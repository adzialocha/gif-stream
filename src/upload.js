function request(method = 'GET', url, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject()
        }
      }
    }
    xhr.send(data)
  })
}

export default function signAndUploadFile(serverUrl, fileData, id) {
  request('GET', `${serverUrl}/api/upload?id=${id}`)
    .then((response) => {
      request('PUT', response.signedUrl, fileData)
    })
}
