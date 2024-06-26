import { ListenerBotApi, WireRecord } from "@uesio/bots"
function request(bot: ListenerBotApi) {
	const fields = [
		"first_name",
		"last_name",
		"email",
		"phone",
		"company",
		"no_employees",
		"location",
		"description",
		"topic",
	]

	const values = fields.reduce(
		(prev, key) => ({
			...prev,
			[key]: ((bot.params.get(key) as string) || "").toLowerCase(),
		}),
		{}
	) as Record<string, string>

	// return

	// Send an email to the user
	const salesEmail = bot.asAdmin.getConfigValue("uesio/web.sales_email")
	let userConfigValue = ""
	let salesConfigValue = ""
	switch (values["topic"]) {
		case "contact request": {
			userConfigValue = "uesio/web.email_template_contact_to_user"
			salesConfigValue = "uesio/web.email_template_contact_to_sales"
			break
		}
		case "demo request": {
			userConfigValue = "uesio/web.email_template_contact_to_sales"
			salesConfigValue = "uesio/web.email_template_demo_to_sales"
			break
		}
		default: {
			break
		}
	}

	const templateIdUser = bot.asAdmin.getConfigValue(userConfigValue)
	const templateIdSales = bot.asAdmin.getConfigValue(salesConfigValue)

	// // Email to user
	bot.asAdmin.runIntegrationAction("uesio/core.sendgrid", "sendemail", {
		to: [values.email],
		from: salesEmail,
		templateId: templateIdUser,
		dynamicTemplateData: {
			firstname: values["first_name"],
			lastname: values["last_name"],
			email: values["email"],
			account: values["company"],
			no_employees: values["no_employees"],
			country: values["location"],
			description: values["description"],
			source: values["topic"],
		},
	})

	// // Email to us
	bot.asAdmin.runIntegrationAction("uesio/core.sendgrid", "sendemail", {
		to: [salesEmail],
		from: salesEmail,
		templateId: templateIdSales,
		dynamicTemplateData: {
			firstname: values["first_name"],
			lastname: values["last_name"],
			email: values["email"],
			phone: values["phone"],
			account: values["company"],
			no_employees: values["no_employees"],
			country: values["location"],
			description: values["description"],
			source: values["topic"],
		},
	})
}
