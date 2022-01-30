import { BASE_URL } from "../utils/constants";
import { Requests } from "../utils/requests";

export class TacoApi {
  public static readonly PREFIX = "taco";

  public static async getPatterns(formulae: unknown[][]) {
    const url = `${BASE_URL}/${TacoApi.PREFIX}/patterns`
    return await Requests.post(url, {
      body: JSON.stringify({ formulae })
    }, async (payload: { data: (string | null)[][] }) => {
      return payload.data
    });
  }
}
