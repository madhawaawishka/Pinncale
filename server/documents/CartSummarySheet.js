module.exports = ({ action, adventure, racing, shooter, sports, }) => {
    const today = new Date();
return `
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>PDF Result Template</title>
    <style>
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 90px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, .15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica',
        }

        .logod {
            display: flex;
            justify-items: center;
        }

        .logoh {
            display: inline;
            margin-right: 20px;
        }

        .name {
            font-size: 32px;
            font-weight: 600;
        }

        .subtitle {
            font-size: 17px;
            font-weight: normal;
        }

        .date {
            float: right;
        }

        .sheetname {
         font-size: 30px;
            text-align: center;
            text-decoration: underline;
        }

        .imagediv {
            margin: 0 auto;
            display: flex;
            justify-items: center;
        }

        .simage {
            margin-top: 35px;
            
        }

        .title {
            margin-top: 30px;
            color: rgb(216, 112, 14);
            font-size: 22px;
            font-weight: 700;
        }

        .am {
            font-size: 18px;
            font-weight: 700;
            color: rgb(11, 196, 11);
        }

        .des {
            font-size: 16px;
            font-weight: 700;
        }
        .ganrelist {
            max-width: 700px;
            margin: 0 auto; 
         }
    </style>
</head>

<body>
    <div class="invoice-box">
        <div class="logod">
            <img class="logoh" width="50px" height="50px" width="150px" height="150px"
                src="https://res.cloudinary.com/dg8cpnx1m/image/upload/v1713894657/Games/cjkembjpn4tijij7hbhi.jpg " />
            <span class="name">PINNACLE<br /><span class="subtitle">Pinnacle gaming pvt(ltd).</span></span>

        </div>
        <p class="date">Date: ${` ${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}`}</p>
        <br />
        <br />
        <h1 class="sheetname">Cart Summary Sheet</h1><br/>

        <br/>
        <span class="title">Ganres That users are interested in</span><br /><br />
        <div class="ganrelist">
            <span class="des">Action: </span><span class="val">${action} users</span><br /><br />
            <span class="des">Adventure: </span><span class="val">${adventure} users</span><br /><br />
            <span class="des">Racing: </span><span class="val">${racing} users</span><br /><br />
            <span class="des">Shooter: </span><span class="val">${shooter} users</span><br /><br/>
            <span class="des">Sports: </span><span class="val">${sports} users</span><br /><br/>
        </div>
        <!--<span class="title">Ganre That took most interest of users is </span><br /><br /> -->
        <br />
        <hr />
        <div class="logod" style="margin-top: 20px;">
            <img class="logoh" width="50px" height="50px" width="150px" height="150px"
                src="https://res.cloudinary.com/dg8cpnx1m/image/upload/v1713894657/Games/cjkembjpn4tijij7hbhi.jpg " />
            <span class="name">PINNACLE<br /><span class="subtitle">Pinnacle gaming pvt(ltd).</span></span>

        </div>
        <p style="font-size: 15px; color: #494646; text-align: center;">Copyright @ 2024 Pinnalce. - All rights reserved</p>


    </div>
</body>

</html>
    `;
};