const urlToObject = queryString => 
    JSON.parse('{"' + decodeURI(queryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

const objectToUrl = obj => 
    Object.keys(obj)
        .reduce((a,k) => {
            a.push(k + '=' + encodeURIComponent(obj[k]));
            return a;
        }, [])
        .join('&');

const mergeUrlParameters = (queryString, newValue = {}) => 
    urlToObject(objectToUrl({ ...obj, ...newValue }));

const removeUrlParameter = (queryString, param) =>
    queryString.replace(new RegExp('[?&]' + param + '=[^&#]*(#.*)?$'), '$1')
        .replace(new RegExp('([?&])' + param + '=[^&]*&'), '$1');

module.exports = {
    urlToObject,
    objectToUrl,
    mergeUrlParameters,
    removeUrlParameter
}