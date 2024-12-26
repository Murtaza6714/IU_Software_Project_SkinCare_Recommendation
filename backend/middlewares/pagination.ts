
export default function(req: any, res: any, next: any) {
    req.pageNo = (req.query.page && Number(req.query.page) > 0) 
    ? Number(req.query.page) : 1;
    
    req.pageSize = (req.query.limit && Number(req.query.limit) > 0 && 
    Number(req.query.limit) <= 100) ? 
    Number(req.query.limit) : 50;

    req.searchText = (req.query.search && req.query.search != "") 
    ? decodeURI(req.query.search) : "";

    req.skipItem = (req.pageNo - 1) * req.pageSize;
    
    next();
    return;
}


