export const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ data, error: null })
}

export const created = (res, data) => {
  return res.status(201).json({ data, error: null })
}

export const error = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ data: null, error: message })
}
