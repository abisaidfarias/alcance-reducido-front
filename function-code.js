function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    if (uri === '/fabricante/infinix' || uri === '/fabricante/infinix/') {
        var response = {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                'location': { value: '/representante/luxuryspa' }
            }
        };
        return response;
    }
    
    return request;
}

