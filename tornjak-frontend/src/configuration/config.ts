export interface DynamicConfig {
    REACT_APP_AUTH_SERVER_URI: string,
    REACT_APP_API_SERVER_URI: string, 
    REACT_APP_SPIRE_HEALTH_CHECK_ENABLE: boolean;
    environment: "DEV" | "PROD";
}

export const defaultConfig: DynamicConfig = {
    REACT_APP_AUTH_SERVER_URI: "",
    REACT_APP_API_SERVER_URI: "http://localhost:10000/", 
    REACT_APP_SPIRE_HEALTH_CHECK_ENABLE: false,
    environment: "DEV"
};

class GlobalConfig {
    config: DynamicConfig = defaultConfig;
    notDefinedYet = true;
  
    public get(): DynamicConfig {
      if (this.notDefinedYet) {
        throw new Error(
          "Global config has not been defined yet. Be sure to call the getter only after the config has been downloaded and set. Probable cause is accessing globalConfig in static context."
        );
      } else {
        return this.config;
      }
    }
  
    public set(value: DynamicConfig): void {
      if (this.notDefinedYet) {
        this.config = value;
        this.notDefinedYet = false;
      } else {
        throw new Error(
          "Global config has already been defined and now has been called second time. This is probably not intended."
        );
      }
    }
  }
  
  export const globalConfig = new GlobalConfig();
  
  export const globalConfigUrl = "config.json";