import {Client, expect} from '@loopback/testlab';
import {GameAppApplication} from '../..';
import {setupApplication} from './test-helper';

describe('UserController', () => {
  let app: GameAppApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('exposes api to get players', async () => {
    await client.get('/api/player').expect(200);
  });

  it('check player api response', async () => {
    const response = await client.get('/api/player');
    expect(response.body).to.Array();
  });
});
