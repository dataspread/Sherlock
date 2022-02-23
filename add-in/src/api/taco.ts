import { BASE_URL } from "../utils/constants";
import { Requests } from "../utils/requests";
import { TacoResponse } from "./taco.types";

export class TacoApi {
  public static readonly PREFIX = "taco";

  public static async getPatterns(formulae: unknown[][]) {
    const url = `${BASE_URL}/${TacoApi.PREFIX}/patterns`;
    return await Requests.post(
      url,
      {
        body: JSON.stringify({ formulae }),
      },
      async (payload: { taco: TacoResponse }) => {
        return payload.taco;
      }
    );
  }

  public static async getPatternsOld(formulae: unknown[][]) {
    const url = `${BASE_URL}/${TacoApi.PREFIX}/patterns`;
    return await Requests.post(
      url,
      {
        body: JSON.stringify({ formulae }),
      },
      async (payload: { data: (string | null)[][] }) => {
        console.log("STONKS", payload);
        return payload.data;
      }
    );
  }
}
