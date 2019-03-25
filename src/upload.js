function request(method = 'GET', url, body) {
  return window.fetch(url, {
    method,
    body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return response.json()
    })
}

export default function signAndUploadFile(serverUrl, fileData, id) {
  request('GET', `${serverUrl}/api/upload?id=${id}`)
    .then((response) => {
      request('PUT', response.signedUrl, fileData)
    })
}
