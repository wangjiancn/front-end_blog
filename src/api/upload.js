import request from '@/utils/request.js'

export function getQiniuToken() {
  return request({
    method: 'get',
    url: '/upload/get_qiniu_token',
  })
}

export function uploadimage(image, token) {
  const formdata = new FormData()
  formdata.append('file', image)
  formdata.append('token', token)
  return request({
    method: 'post',
    url: 'https://up.qiniup.com',
    data: formdata,
    header: { 'Content-Type': 'multipart/form-data' },
  })
}
