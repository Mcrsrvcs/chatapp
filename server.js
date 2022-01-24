const http = require("http");//this is for getting http means immporting http 
const express = require("express");//this is for getting express means for immporting express

const app = express();
const server = http.createServer(app);;//this will ready an app of express for runing on server 
const port = process.env.PORT || 3001;

//serving a file on server .this means when a user go on this address of server then server serve any file : 
app.get('/', (req, res) => {//we are using app.get('/',(req,res)) for getting file.
    //we used two peramenter req means request and res means response here in an arrow function//
    res.sendFile(__dirname+'/index.html');//we can serve any file by using res.sendFile() function
    //we added __dirname for taking path from root directory for a relevent means perfect path.
    // __dirname automatically detects folder name in which index.html file exists means name of root directory.
})/*we need to serve our css,img,ico,js etc files those are connected with our html file but We cannot directly 
    use those files when we are using node server these files are static files so we need to create a
    public folder and then we will put css,img,ico and js etc files in that public folder  */
app.use(express.static(__dirname+'/public'));/*we are giving address of our static file folder 
by express.static() function .Now public folder is that folder which can be used by index.html to use static files.
now css,img,js etc files will link with index.html.we No Need to add public folder in path we can directly give path
as : style/style.css because we already given path of public folder.we directly give path of that folder to which
we wants to call.  */


/*Socket.io setup*/
const io=require("socket.io")(server);//we used require() function for immporting socket.io
 //here we passed server variable which defines the server port.

 var users={};//this a variable/object
 var user;
io.on("connection",(socket)=>{//'on' is a function and 'connection' is a defult Event that means when any one join
    socket.on('new-user-joined',(username)=>{//we will receave username by using this function
            users[socket.id]=username;/*we say that create a new user in 'users' variable
            in 'users' variable we created a index that is 'socket.id' that's value is 'username'
            this will store the name and id of user in this variable . socket.id means a unique id of user*/
            // then run the given arrow function .
            // One person who connect with this connection that one person is a socket.
            //socket.io will give a unique id to that one.
            socket.broadcast.emit('user-connected',username);/*socket.broadcast.emit() function is used for telling 
                                    another users that a new user is jioned*/
            io.emit("user-list",users);/*io.emit is used for targeting all the sockets.
            'io.emit' is passed an Event that is 'user-list' and a vaiable that is 'users'
            this same code is used in desconnect event*/
    });
    socket.on("disconnect",()=>{//'disconnect' is a defult Event that means when any one left the chat
        socket.broadcast.emit('user-disconnected',user=users[socket.id]);/*here we says that when any user 
        left the chat then emit 'user-disconnected' event and we pass user variable that is equals to 
        id of which one is left the chat*/
        delete users[socket.id];/*'delete will delete index and value of user which one is 
        left the chat from users Object*/
        io.emit("user-list",users);/*io.emit is used for targeting all the sockets.
            'io.emit' is passed an Event that is 'user-list' and a vaiable that is 'users'
            this same code is used in connection event*/
    })

    socket.on('message',(data)=>{
        socket.broadcast.emit('message',{user : data.user,msg: data.msg});
    })
});                  

//\\ process.env.PORT is for cheaking for any port if avalable on our local machine OR|| open on 3000 port
server.listen(port, () => {//we say that when server starts then print Server Started on port is for port no.
    console.log("Server Started on " + port);
})

// for running this goto package.json edit "test" :   "echo \"Error: no test specified\" && exit 1"
// write                                   "test" :   "nodemon server.js"
// write 'nodemon' and then the 'name of file which you wants to run'