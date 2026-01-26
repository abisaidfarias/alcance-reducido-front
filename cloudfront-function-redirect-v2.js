function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    if (uri === '/fabricante/infinix' || uri === '/fabricante/infinix/') {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                'location': { value: '/representante/luxuryspa' }
            }
        };
    }
    
    return request;
}

