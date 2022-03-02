const getTemplateList = async (client) => {

    const getTemplateHeader = {
        "on-behalf-of": "The subuser's username. This header generates the API call as if the subuser account was making the call."
      };
      const getTemplateParams = {
        "generations": "dynamic",
        "page_size": 100
      };
      
      const getTemplateRequest = {
        url: `/v3/templates`,
        method: 'GET',
        // headers: getTemplateHeader,
        qs: getTemplateParams
      }

    try{        
        const result = await client.request(getTemplateRequest)
        return result
      }
      catch(error){
        return error
      }
}

module.exports = {getTemplateList}