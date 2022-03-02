const docusign = require('docusign-esign');

const getTemplates = async (args, accessToken) => {
  
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(args.basePath);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);
    let templatesApi = new docusign.TemplatesApi(dsApiClient),
      results = null;
    
    try{
        results = await templatesApi.listTemplates(args.accountId)
    }
    catch(error){
        return error
    }
    
    return results;
  };

  module.exports = {getTemplates}