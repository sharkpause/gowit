package handlers

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gopkg.in/gomail.v2"
)
type ContactRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Question string `json:"question" binding:"required,min=1,max=200"` //please frontend limit question to x-amount of character
}
func Sendmail() gin.HandlerFunc{
	return func(context *gin.Context){
		var req ContactRequest
		if err:= context.ShouldBindJSON(&req); err!=nil{
			context.JSON(400,gin.H{"Error": "Please provide a valid field"})
			return
		}
		
		mail := gomail.NewMessage()
		
		system:= struct {
			SystemEmail string 
			EmailSecret string
			EmailServer string
			EmailPort int
			BccMailingList []string
		}{
			SystemEmail: os.Getenv("ADMIN_EMAIL"), //<Email>
			EmailSecret: os.Getenv("ADMIN_SECRET"), //<Google app password to the corresponding account>
			EmailServer: os.Getenv("EMAIL_SERVER"), //<smtp.gmail.com> if using google, yea 
			EmailPort: func()int{
				p,_:= strconv.Atoi(os.Getenv("EMAIL_PORT")) //587
				return p
			}(),
			BccMailingList: strings.Split(os.Getenv("MAILING_LIST"),","), //<Bcc> can be null, depends
		}

		mail.SetHeader("From", system.SystemEmail)
		mail.SetHeader("To", req.Email)
		mail.SetHeader("Cc", system.SystemEmail)
		mail.SetHeader("Subject", "Your question has been received")
		if len(system.BccMailingList) > 0{
			mail.SetHeader("Bcc", system.BccMailingList...)
		}
		mail.SetHeader("Reply-To", req.Email)
		body:= fmt.Sprintf(`
			Dear %s,

			Thank you for contacting Gowit.

			We have received your message and our support team will review your inquiry. If further assistance is required, we will get back to you as soon as possible.
			Your message:
			--------------------------------
			%s
			--------------------------------
			Please note that response times may vary depending on the volume of requests.

			We appreciate your patience and thank you for reaching out.

			Best regards,  
			Gowit Support Team`, 
			
			req.Name, req.Question)
		
		mail.SetBody("text/plain", body)
		dial := gomail.NewDialer(system.EmailServer,system.EmailPort,system.SystemEmail,system.EmailSecret)

		e:=dial.DialAndSend(mail)
				
		if e!=nil{
			context.JSON(500, gin.H{"Error":"Failed to send email"})
			fmt.Println(e)
			return
		}
		context.JSON(200, gin.H{
			"message": "Message sent",
		})
	}
}