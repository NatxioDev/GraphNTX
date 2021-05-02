const router = (route) => {
    console.log(route);
    switch (route){
        case "#/":
            return console.log("grafos!");
        case "#/jhonson":
            return console.log("jhonson!");
        default:
            return console.log("404");
    }
}

export {router}