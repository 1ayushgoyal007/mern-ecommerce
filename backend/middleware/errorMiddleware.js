const notFound = (req,res,next)=>{
    const error =  new Error(`Not Found Url-${req.originalUrl}`);
    res.status(404);
    next(error);
}




export { notFound }