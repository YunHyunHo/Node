const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})) 
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// static파일을 보관하기 위해 publick폴더를 쓸꺼다. 라고 명시
app.use('/publick', express.static('publick'))

var db;
MongoClient.connect('mongodb+srv://roal3437:dlsrksemf1@cluster0.aj3m5a2.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
  if (에러) return console.log(에러)
  db = client.db('todoApp');

  app.listen(8080, function () {
    console.log('listening on 8080')
  });
});

app.get('/',(req, res) => {
  res.render('index.ejs')
})

app.get('/write', function(요청, 응답) { 
  응답.render('write.ejs')
});

app.post('/add', function(요청, 응답){
  응답.send('전송완료');
  db.collection('counter').findOne({name: '게시물갯수'}, (에러, 결과) => {
    
    let total = 결과.totalPost
    
    db.collection('post').insertOne( {_id: total ,제목 : 요청.body.title, 날짜 : 요청.body.date } , function(){
      console.log('저장완료')
      db.collection('counter').updateOne({name: '게시물갯수'}, {$inc : {totalPost: 1}}, (에러, 결과) => {
        if(에러) return console.log(에러)
      })
    });
  })
  
});
 
app.delete('/delete', function(요청, 응답){
  console.log(요청.body)
  요청.body._id = parseInt(요청.body._id) 
  db.collection('post').deleteOne(요청.body, (에러, 결과) => {
    console.log('삭제완료')
    // 요청을 성공했습니다.
    응답.status(200).send({ message: '성공했습니다.'});
  })
});

app.get('/list', (요청, 응답) => {
  db.collection('post').find().toArray((에러, 결과) => {
    응답.render('list.ejs', {posts: 결과})
  })
  
})

// detail

app.get('/detail/:id', (요청, 응답) => {
  db.collection('post').findOne({ _id : parseInt(요청.params.id) }, (에러, 결과) => {
    console.log(결과)
    응답.render('detail.ejs', {data : 결과} )
  })
});

app.get('/edit/:id', (요청,응답) => {
  db.collection('post').findOne({_id : parseInt(요청.params.id)}, (에러, 결과) =>{
    응답.render('edit.ejs', {post: 결과})
  })
})