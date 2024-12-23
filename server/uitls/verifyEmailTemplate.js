const verifyEmailTempate = ({name,url})=>{
return `
    <P>Dear ${name}</p>
    <p>Thank you for resgistering Blinkeit...</p>
    <a href=${url} style="color:white;background:blue;margin-top:10px,padding:20px,display:block">
        Verify Email
    </a>

`
}

export default verifyEmailTempate