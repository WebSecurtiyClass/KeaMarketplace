import xss from 'xss'

export const preventXss = (req, res, next) => {
    Object.entries(req.body).forEach(([key, _value]) => {
        req.body[key] = xss(req.body[key])
    })
    Object.entries(req.query).forEach(([key, _value]) => {
        req.query[key] = xss(req.query[key])
    })
    Object.entries(req.params).forEach(([key, _value]) => {
        req.params[key] = xss(req.params[key])
    })
    next()
}
