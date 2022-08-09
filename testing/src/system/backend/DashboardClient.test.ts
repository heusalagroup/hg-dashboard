/**
 * System test for DashboardClient and Dashboard backend.
 *
 * E.g. this test is meant to connect to the real backend and test real
 * functionality.
 */

import { LogLevel } from "../../fi/hg/core/types/LogLevel";
import { EmailTokenDTO } from "../../fi/hg/core/auth/email/types/EmailTokenDTO";
import { MailHogClient } from "../../fi/hg/core/mailhog/MailHogClient";
import { find, isArrayOf } from "../../fi/hg/core/modules/lodash";
import { isWorkspace, Workspace } from "../../fi/hg/dashboard/types/Workspace";
import { ProfileDTO } from "../../fi/hg/dashboard/types/dto/ProfileDTO";
import { createUser, isUser, User } from "../../fi/hg/dashboard/types/User";
import { NewWorkspaceDTO } from "../../fi/hg/dashboard/types/dto/NewWorkspaceDTO";
import { DashboardClient } from "../../fi/hg/dashboard/services/DashboardClient";

DashboardClient.setLogLevel(LogLevel.NONE);

const BACKEND_URL = 'http://localhost:3500';
const MAILHOG_URL = 'http://localhost:8025';
const TEST_EMAIL_ADDRESS = 'foo@example.fi';
const TEST_EMAIL_LOCAL_PART = 'foo';
const WORKSPACE_NAME = "Example Inc";

describe('system', () => {

    const mailHog = new MailHogClient(MAILHOG_URL);

    describe('backend', () => {

        describe('DashboardClient', () => {

            describe('url management', () => {

                it('can get and set default backend URL', () => {
                    const orig = DashboardClient.getDefaultUrl();
                    try {
                        expect(DashboardClient.getDefaultUrl() ).toBe('/api');
                        DashboardClient.setDefaultUrl('/api/v2020');
                        expect(DashboardClient.getDefaultUrl() ).toBe('/api/v2020');
                    } finally {
                        DashboardClient.setDefaultUrl(orig);
                    }
                });

                it('can create service with default URL', () => {
                    const service = new DashboardClient();
                    expect( service.getUrl() ).toBe( '/api');
                });

                it('can create service with custom URL', () => {
                    const service = new DashboardClient('/api/v2021');
                    expect( service.getUrl() ).toBe( '/api/v2021');
                });

            });

            describe('public resources', () => {

                it('can get index page', async () => {
                    const service = new DashboardClient(`${BACKEND_URL}`);
                    const indexDto = await service.getIndex();
                    expect( indexDto?.hello ).toBe( 'world');
                });

            });

            describe('login', () => {

                beforeEach(async () => {
                    await mailHog.deleteMessages();
                });

                it('can initiate authentication using email address', async () => {

                    const service = new DashboardClient(`${BACKEND_URL}`);
                    const response : EmailTokenDTO = await service.authenticateUsingEmail(TEST_EMAIL_ADDRESS);
                    expect( response?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( response?.token ).toBeDefined();
                    expect( response?.verified ).toBe(undefined);

                    const messages = await mailHog.getMessages();
                    const emailBody = messages[0]?.MIME?.Parts[0]?.Body;

                    expect( emailBody ).toContain('Auth code is:');

                    const [start, codeStringWithRest] = emailBody.split(/Auth code is: */);
                    const [codeString, ...rest] = codeStringWithRest.split('\r\n');

                    expect( codeString ).toMatch(/[0-9]{4}/);

                });

                it('can authenticate successfully using email', async () => {

                    const service = new DashboardClient(`${BACKEND_URL}`);
                    const response : EmailTokenDTO = await service.authenticateUsingEmail(TEST_EMAIL_ADDRESS);
                    expect( response?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( response?.token ).toBeDefined();
                    expect( response?.verified ).toBe(undefined);

                    const messages = await mailHog.getMessages();
                    const emailBody = messages[0]?.MIME?.Parts[0]?.Body;

                    expect( emailBody ).toContain('Auth code is:');

                    const [start, codeStringWithRest] = emailBody.split(/Auth code is: */);
                    const [codeString, ...rest] = codeStringWithRest.split('\r\n');

                    expect( codeString ).toMatch(/[0-9]{4}/);

                    const verifyCodeResponse : EmailTokenDTO = await service.verifyEmailCode(response, codeString);
                    expect( verifyCodeResponse?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( verifyCodeResponse?.token ).toBeDefined();
                    expect( verifyCodeResponse?.verified ).toBe(true);

                });

                it('cannot authenticate using wrong code', async () => {

                    const service = new DashboardClient(`${BACKEND_URL}`);
                    const response : EmailTokenDTO = await service.authenticateUsingEmail(TEST_EMAIL_ADDRESS);
                    expect( response?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( response?.token ).toBeDefined();
                    expect( response?.verified ).toBe(undefined);

                    const messages = await mailHog.getMessages();
                    const emailBody = messages[0]?.MIME?.Parts[0]?.Body;

                    expect( emailBody ).toContain('Auth code is:');

                    const [start, codeStringWithRest] = emailBody.split(/Auth code is: */);
                    const [codeString, ...rest] = codeStringWithRest.split('\r\n');

                    expect( codeString ).toMatch(/[0-9]{4}/);

                    try {
                        const wrongCode = codeString === '1234' ? '4321' : '1234';
                        const verifyCodeResponse : EmailTokenDTO = await service.verifyEmailCode(response, wrongCode);
                        expect( verifyCodeResponse?.email ).toBe(TEST_EMAIL_ADDRESS);
                        expect( verifyCodeResponse?.token ).toBeDefined();
                        expect( verifyCodeResponse?.verified ).toBe(true);
                    } catch (err) {
                        expect(`${err}`).toContain('403 Error 403 for post');
                    }

                });

                it('can verify authenticated session', async () => {

                    const service = new DashboardClient(`${BACKEND_URL}`);
                    const response : EmailTokenDTO = await service.authenticateUsingEmail(TEST_EMAIL_ADDRESS);
                    expect( response?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( response?.token ).toBeDefined();
                    expect( response?.verified ).toBe(undefined);

                    const messages = await mailHog.getMessages();
                    const emailBody = messages[0]?.MIME?.Parts[0]?.Body;

                    expect( emailBody ).toContain('Auth code is:');

                    const [start, codeStringWithRest] = emailBody.split(/Auth code is: */);
                    const [codeString, ...rest] = codeStringWithRest.split('\r\n');

                    expect( codeString ).toMatch(/[0-9]{4}/);

                    const verifyCodeResponse : EmailTokenDTO = await service.verifyEmailCode(response, codeString);
                    expect( verifyCodeResponse?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( verifyCodeResponse?.token ).toBeDefined();
                    expect( verifyCodeResponse?.verified ).toBe(true);

                    const verifyTokenResponse : EmailTokenDTO = await service.verifyEmailToken(verifyCodeResponse);
                    expect( verifyTokenResponse?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( verifyTokenResponse?.token ).toBeDefined();
                    expect( verifyTokenResponse?.verified ).toBe(true);

                });

                it('can login successfully using email', async () => {

                    const service = new DashboardClient(`${BACKEND_URL}`);

                    expect( service.hasVerifiedSession() ).toBe(false);
                    expect( service.getEmailAddress() ).toBe(undefined);
                    expect( service.getVerifiedEmailAddress() ).toBe(undefined);

                    await service.loginUsingEmail(TEST_EMAIL_ADDRESS);

                    expect( service.hasVerifiedSession() ).toBe(false);
                    expect( service.getEmailAddress() ).toBe(TEST_EMAIL_ADDRESS);
                    expect( service.getVerifiedEmailAddress() ).toBe(undefined);

                    const response = service.getSessionToken();
                    expect( response?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( response?.token ).toBeDefined();
                    expect( response?.verified ).toBe(undefined);

                    const messages = await mailHog.getMessages();
                    const emailBody = messages[0]?.MIME?.Parts[0]?.Body;

                    expect( emailBody ).toContain('Auth code is:');

                    const [start, codeStringWithRest] = emailBody.split(/Auth code is: */);
                    const [codeString, ...rest] = codeStringWithRest.split('\r\n');

                    expect( codeString ).toMatch(/[0-9]{4}/);

                    await service.verifySessionWithCode(codeString);

                    expect( service.hasVerifiedSession() ).toBe(true);
                    expect( service.getVerifiedEmailAddress() ).toBe(TEST_EMAIL_ADDRESS);

                    const verifyCodeResponse : EmailTokenDTO | undefined = service.getSessionToken();
                    expect( verifyCodeResponse?.email ).toBe(TEST_EMAIL_ADDRESS);
                    expect( verifyCodeResponse?.token ).toBeDefined();
                    expect( verifyCodeResponse?.verified ).toBe(true);

                });

            });

            describe('authenticated profile', () => {

                let service = new DashboardClient(`${BACKEND_URL}`);
                let workspaceId : string = '';
                let workspaceName : string = '';

                beforeAll( async () => {

                    service = new DashboardClient(`${BACKEND_URL}`);

                    await service.loginUsingEmail(TEST_EMAIL_ADDRESS);

                    const messages = await mailHog.getMessages();
                    const emailBody = messages[0]?.MIME?.Parts[0]?.Body;
                    const [start, codeStringWithRest] = emailBody.split(/Auth code is: */);
                    const [codeString, ...rest] = codeStringWithRest.split('\r\n');

                    await service.verifySessionWithCode(codeString);

                    await service.deleteWorkspaces();

                    const item : Workspace = await service.createWorkspace(workspaceName);
                    workspaceId = item?.id;
                    workspaceName = item?.name;

                });

                it('can get profile', async () => {
                    const profile : ProfileDTO = await service.getMyProfile();
                    expect( profile?.email ).toBe(TEST_EMAIL_ADDRESS);
                });

            });

            describe('workspaces', () => {

                let service = new DashboardClient(`${BACKEND_URL}`);

                beforeAll( async () => {

                    service = new DashboardClient(`${BACKEND_URL}`);

                    await service.loginUsingEmail(TEST_EMAIL_ADDRESS);

                    const messages = await mailHog.getMessages();
                    const emailBody = messages[0]?.MIME?.Parts[0]?.Body;
                    const [start, codeStringWithRest] = emailBody.split(/Auth code is: */);
                    const [codeString, ...rest] = codeStringWithRest.split('\r\n');

                    await service.verifySessionWithCode(codeString);

                });

                beforeEach( async () => {
                    await service.deleteWorkspaces();
                });

                it('can list workspaces when no workspace exists', async () => {
                    const list = await service.getMyWorkspaceList();
                    expect( isArrayOf(list, isWorkspace) ).toBe(true);
                    expect( list?.length ).toBe(0);
                });

                it('can create with resources and list workspaces', async () => {

                    const item : NewWorkspaceDTO = await service.createWorkspaceWithResources(WORKSPACE_NAME);
                    expect( item?.payload?.id ).toBeDefined();
                    expect( item?.payload?.id ).not.toBe('new');
                    expect( item?.payload?.id ).not.toBe('');
                    expect( item?.payload?.name ).toBe(WORKSPACE_NAME);

                    expect( item?.users?.length ).toBe(1);
                    expect( item?.users[0].name).toBe(TEST_EMAIL_LOCAL_PART);
                    expect( item?.users[0].email).toBe(TEST_EMAIL_ADDRESS);

                });

                it('can create and list workspaces', async () => {

                    const item : Workspace = await service.createWorkspace(WORKSPACE_NAME);
                    expect( item?.id ).toBeDefined();
                    expect( item?.id ).not.toBe('new');
                    expect( item?.id ).not.toBe('');
                    expect( item?.name ).toBe(WORKSPACE_NAME);

                    const list = await service.getMyWorkspaceList();
                    expect( isArrayOf(list, isWorkspace) ).toBe(true);
                    expect( list?.length ).toBe(1);
                    expect( list[0]?.id ).toBe(item?.id);
                    expect( list[0]?.name ).toBe(item?.name);

                });

                it('can create and list workspace with categories', async () => {

                    const item : Workspace = await service.createWorkspace(
                        WORKSPACE_NAME
                    );

                    expect( item?.id ).toBeDefined();
                    expect( item?.id ).not.toBe('new');
                    expect( item?.id ).not.toBe('');
                    expect( item?.name ).toBe(WORKSPACE_NAME);

                    const list = await service.getMyWorkspaceList();
                    expect( isArrayOf(list, isWorkspace) ).toBe(true);
                    expect( list?.length ).toBe(1);
                    expect( list[0]?.id ).toBe(item?.id);
                    expect( list[0]?.name ).toBe(item?.name);

                });

            });

            describe('users', () => {

                let service = new DashboardClient(`${BACKEND_URL}`);
                let workspaceId : string = '';
                let workspaceName : string = '';

                beforeAll( async () => {

                    service = new DashboardClient(`${BACKEND_URL}`);

                    await service.loginUsingEmail(TEST_EMAIL_ADDRESS);

                    const messages = await mailHog.getMessages();
                    const emailBody = messages[0]?.MIME?.Parts[0]?.Body;
                    const [start, codeStringWithRest] = emailBody.split(/Auth code is: */);
                    const [codeString, ...rest] = codeStringWithRest.split('\r\n');

                    await service.verifySessionWithCode(codeString);
                    await service.deleteWorkspaces();
                    const item : Workspace = await service.createWorkspace(workspaceName);
                    workspaceId = item?.id;
                    workspaceName = item?.name;

                });

                it('can list users when there is only initial user', async () => {
                    const list = await service.getMyUserList(workspaceId);
                    expect( isArrayOf(list, isUser) ).toBe(true);
                    expect( list?.length ).toBe(1);
                });

                it('can create and list users', async () => {

                    const item : User = await service.createUser(
                        createUser(
                            workspaceId,
                            'new',
                            'Foo',
                            'foo@bar.fi'
                        )
                    );

                    const itemId = item?.id;
                    expect( itemId ).toBeDefined();
                    expect( itemId ).not.toBe('new');
                    expect( itemId ).not.toBe('');
                    expect( item?.name ).toBe('Foo');
                    expect( item?.email ).toBe('foo@bar.fi');

                    const list : readonly User[] = await service.getMyUserList(workspaceId);
                    expect( isArrayOf(list, isUser) ).toBe(true);
                    expect( list?.length ).toBe(2);

                    const itemFromList : User | undefined = find(list, (i: User) : boolean => i?.id == itemId);

                    expect( itemFromList?.id ).toBe(itemId);
                    expect( itemFromList?.name ).toBe('Foo');
                    expect( itemFromList?.email ).toBe('foo@bar.fi');

                });

                it('can create and fetch users', async () => {

                    const item : User = await service.createUser(
                        createUser(
                            workspaceId,
                            'new',
                            'Foo',
                            'foo@bar.fi'
                        )
                    );

                    const userId = item?.id;
                    expect( userId ).toBeDefined();
                    expect( userId ).not.toBe('new');
                    expect( userId ).not.toBe('');
                    expect( item?.name ).toBe('Foo');
                    expect( item?.email ).toBe('foo@bar.fi');

                    const fetchedItem = await service.getMyUser(workspaceId, userId);
                    expect( fetchedItem?.id ).toBe(userId);
                    expect( fetchedItem?.name ).toBe('Foo');
                    expect( fetchedItem?.email ).toBe('foo@bar.fi');

                });

                describe('modifications', () => {

                    let item : User;
                    let userId : string;

                    beforeEach( async () => {

                        item = await service.createUser(
                            createUser(
                                workspaceId,
                                'new',
                                'Foo',
                                'foo@bar.fi'
                            )
                        );

                        userId = item?.id;

                    });

                    it('can update user name', async () => {

                        expect( userId ).toBeDefined();
                        expect( userId ).not.toBe('new');
                        expect( userId ).not.toBe('');
                        expect( item?.name ).toBe('Foo');

                        const updatedItem = await service.updateMyUser(
                            workspaceId,
                            userId,
                            {
                                name: 'New Name'
                            }
                        );
                        expect( updatedItem?.id ).toBe(userId);
                        expect( updatedItem?.name ).toBe('New Name');

                        const fetchedItem = await service.getMyUser(workspaceId, userId);
                        expect( fetchedItem?.id ).toBe(userId);
                        expect( fetchedItem?.name ).toBe('New Name');

                    });

                });

            });

        });

    });

});
