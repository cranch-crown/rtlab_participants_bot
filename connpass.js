var ConnPass = function(){
    const EVENT_ID = PropertiesService.getScriptProperties().getProperty("EVENT_ID");
    const ENDPOINT = PropertiesService.getScriptProperties().getProperty("CONNPASS_ENDPOINT");

    var url = ENDPOINT + '?event_id=' + EVENT_ID;
    var options = {
        'method': 'GET'
    };
    var api = UrlFetchApp.fetch(url, options);
    var response = JSON.parse(api.getContentText());

    this.partisipants = response.events[0].accepted;
    this.url = response.events[0].url;

    var cache = CacheService.getScriptCache();
    this.cachedParticipants = cache.get('participants');
    
    cache.put('participants', this.partisipants, 600);

    this.fetchParticipants = function(){
        if(this.cachedParticipants == null){
            return {
                fluctuation: null,
                current: this.partisipants
            }
        }

        return {
            fluctuation: this.partisipants - this.cachedParticipants,
            current: this.partisipants
        }
    }

};