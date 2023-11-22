import { ListenerBotApi } from "@uesio/bots"

export default function createlogin(bot: ListenerBotApi) {
	const redirect = "/site/app/uesio/web/changepassword"
	const username = bot.params.get("username")
	const email = bot.params.get("email")
	const code = bot.params.get("code")
	const host = bot.params.get("host")
	const link = host + redirect + "?code=" + code + "&username=" + username
	const contenttype = "text/html"
	const from = "info@ues.io"
	const subject = "User created in ues.io web"
	const body = `
	<!DOCTYPE html>
	<html>
		<body>
			A user account has been created for you in ues.io web).<br/>
			Your username is: ${username}.<br/>
			<br/>
			You can set your password and log in using the link below:<br/>
			${link}
		</body>
	</html>`

	bot.asAdmin.runIntegrationAction("uesio/core.sendgrid", "sendemail", {
		to: [email],
		from,
		subject,
		plainbody: body,
		contenttype,
	})
}
