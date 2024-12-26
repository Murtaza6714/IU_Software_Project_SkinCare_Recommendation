import axios from "axios"
describe('Ping API', () => {
  it('Should run Ping API', async () => {
    const response = await axios.get('http://localhost:8080/ping');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('status');
    expect(response.data).toHaveProperty('statusCode');
    expect(response.data).toHaveProperty('data');
  });

});
