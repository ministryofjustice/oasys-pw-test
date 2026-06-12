import { APIRequestContext } from '@playwright/test'

import { restApiUrls } from './restApiUrls'
import { testEnvironment } from '../../localSettings'

const restConfig = testEnvironment.rest
var token = ''


/**
 * Get multiple responses from any of the endpoints defined in restApiUrls.ts.
 * Parameter is an EndpointParams object array, which includes the endpoint name, crn, laoPrivilege, plus other parameters that may be relevant depending on the endpoint.
 * 
 * The RestResponse array return value includes url called, status code, returned data and error message if any.
 */
export async function getMultipleRestData(parameters: EndpointParams[], request: APIRequestContext): Promise<RestResponse[]> {

    const response: RestResponse[] = []

    for (let i = 0; i < parameters.length; i++) {
        const r = await getRestData(parameters[i], request)
        response.push(r)
    }
    return response
}

/**
 * Get a response from any of the endpoints defined in restApiUrls.ts.
 * Parameter is an EndpointParams object, which includes the endpoint name, crn, laoPrivilege, plus other parameters that may be relevant depending on the endpoint.
 * 
 * The RestResponse return value includes the url called, status code, returned data and error message if any.
 */
export async function getRestData(parameters: EndpointParams, request: APIRequestContext): Promise<RestResponse> {

    // Construct the URL with parameters
    restApiUrls.filter((endpoint) => endpoint.endpoint == parameters.endpoint)[0].url
    let url = (' ' + restApiUrls.filter((endpoint) => endpoint.endpoint == parameters.endpoint)[0].url).slice(1)  // have to force copying to a new object to avoid problems with replace function
    Object.keys(parameters).forEach((parameter) => {
        if (parameter != 'endpoint') {
            url = url.replace(`{${parameter}}`, parameters[parameter as keyof EndpointParams] as string)
        }
    })

    var restResponse: RestResponse = { url: url, statusCode: 'ok', result: null, message: null, responseTime: null }

    try {
        await getTokenIfRequired()
        oasysDateTime.startTimer('restResponse')

        const response = await request.get(`${restConfig.baseUrl}${url}`, {

            headers: {
                'authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        })
        restResponse.result = await response.json()

        if (response.status() != 200) {
            restResponse.statusCode = getStatusCode(response.status())
            restResponse.message = restResponse.result['message']
        }
        restResponse.responseTime = oasysDateTime.elapsedTime('restResponse')
    }
    catch (err) {
        restResponse.statusCode = 'error'
        restResponse.message = JSON.stringify(err)
    }

    return restResponse
}

async function getTokenIfRequired() {

    if (token == '') {

        const tokenUrl = `${restConfig.baseUrl}${restApiUrls.filter((endpoint) => endpoint.endpoint == 'token')[0].url}`
        const credentials = Buffer.from(`${restConfig.clientId}:${restConfig.clientSecret}`).toString('base64')

        const body = new URLSearchParams()
        body.append('grant_type', 'client_credentials')

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        })

        const data = await response.json()
        token = data.access_token
    }
}

function getStatusCode(status: number): RestStatus {

    switch (status) {
        case 0: return 'error'
        case 200: return 'ok'
        case 400: return 'badRequest'
        case 403: return 'forbidden'
        case 404: return 'notFound'
        case 409: return 'conflict'
    }
}



