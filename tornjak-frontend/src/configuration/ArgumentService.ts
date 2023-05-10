import { globalConfig, DynamicConfig } from "./config";

export class ArgumentService {
  public static getSomeDataFromApi(): DynamicConfig {
    console.log(
      "service method performing some acion with following config: ",
      globalConfig.get()
    ); // correct way to obtain the config
    return globalConfig.get();
  }
}