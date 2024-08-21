const express = require("express");
const app = express();
app.use(express.json());

//#region PostgreSQL 연결

// const { Client } = require("pg");
// const dbClient = new Client({
//     user: "DB 유저아이디",
//     host: "DB 아이피",
//     database: "DB 이름",
//     password: "DB 비번",
//     port: 5432
// });

// dbClient.connect(); 

//#endregion

/*
    유저
     로그인
     회원가입
     캐릭터
     홈
     완료된 퀘스트 기록
     소비 기록
    
    상점
     상점 아이템
     
    그룹
     대외 그룹 챌린지
     진행중인 그룹 챌린지
     친선 그룹챌린지
*/

app.listen(8000, () => {
    console.log("서버가 실행 중입니다: 포트 8000");
});





// 회원가입
app.get('/signIn/:id/:pwd/:kakaoAcc', function(req, res){ 
    // 회원가입 처리 로직
    
    try {
        var params = req.params;
    
        dbClient.query(`Insert INTO ______ VALUES('${params.id}', '${params.pwd}')`, (error, result) => {
            if (error) {
                res.status(500).json({ isSucceed: false });
            } else {
                res.status(200).json({ isSucceed: true });
            }
        });
    } catch (error) {
        res.status(500).json({ isSucceed: false });
    }


});




// 로그인
// 로그인 성공시 오늘의 사용량, 어제 사용량, 레벨, 성공한 도전과제, 앱 설치후 평균 절약 금액, 도전과제 3개
app.get('/logIn/:id/:pwd', function (req, res) {
    try {
        var params = req.params;
    
        dbClient.query(`SELECT count(*) FROM users WHERE [id] = '${params.id}' AND [pwd] = '${params.pwd}'`, (error, result) => {
            if (error) {
                res.status(500).json({ isSucceed: false, });
            } else {
                if(result.rows[0].count == 1){
                   
                    // 로그인 후 데이터 반환
                    dbClient.query(`SELECT {}, {}, {}, {}, {}, {}, {}, {} TOP(3) FROM users WHERE [id] = '${params.id}' AND [pwd] = '${params.pwd}'`, (err, ans) =>{
                        res.json({

                        }) ;
                    });
                    
                }
                else{
                    res.status(200).json({ isSucceed: false});
                }
            }
        });
    } catch (error) {
        res.status(500).json({ isSucceed: false });
    }
});






// 홈화면 
// 오늘의 사용량, 어제 사용량, 레벨, 성공한 도전과제, 앱 설치후 평균 절약 금액, 도전과제 3개

app.get('/home/:id/:pwd', function (req, res) {
    try {
        var params = req.params;
    
        dbClient.query(`SELECT {}, {}, {}, {}, {}, {}, {}, {} FROM users WHERE [id] = '${params.id}' AND [pwd] = '${params.pwd}'`, (err, ans) =>{
            if (error) {
                res.status(500).json({ isSucceed: "화면을 가져오는중 문제가 발생하였습니다." });
            } else {
                   
            }
        });
    } catch (error) {
        res.status(500).json({ isSucceed: false });
    }
});







// 통계 화면
// 한달 평균 소비량, 지금까지 줄인 소비금액, 레벨, 친구들의 (한달 평균 소비량, 지금까지 줄인 소비금액, 레벨)

app.get('/analyze', function (req, res) {
    try {
        var params = req.params;
    
        dbClient.query(`SELECT {}, {}, {}, {}, {}, {}, {}, {} FROM users WHERE [id] = '${params.id}' AND [pwd] = '${params.pwd}'`, (err, ans) =>{
            if (error) {
                res.status(500).json({ isSucceed: "화면을 가져오는중 문제가 발생하였습니다." });
            } else {
                   
            }
        });
    } catch (error) {
        res.status(500).json({ isSucceed: false });
    }
});




// 쇼핑
// 상품목록, (인기, 카테고리, 가격 등) 검색 쿼리, 상품 이미지, 상세설명, 가격, 리뷰

app.get('/shop', function (req, res) {
    try {
        var params = req.params;
    
        dbClient.query(`QUERY`, (error, result) => {
            if (error) {
                res.status(500).json({ isSucceed: false });
            } else {
                let countValue = result.rows[0].count;
                res.status(200).json({ isSucceed: countValue == 1 });
            }
        });
    } catch (error) {
        res.status(500).json({ isSucceed: false });
    }
});




// 구매 요청
// 선택 상품 목록, 총 가격, 결제 진행 res

app.get('/home', function (req, res) {
    try {
        var params = req.params;
    
        dbClient.query(`QUERY`, (error, result) => {
            if (error) {
                res.status(500).json({ isSucceed: false });
            } else {
                let countValue = result.rows[0].count;
                res.status(200).json({ isSucceed: countValue == 1 });
            }
        });
    } catch (error) {
        res.status(500).json({ isSucceed: false });
    }
});