import { ListenerBotApi, WireRecord } from "@uesio/bots"
function demorequest(bot: ListenerBotApi) {
	const fields = [
		"first_name",
		"last_name",
		"email",
		"company",
	]

	const values = fields.reduce(
		(prev, key) => ({
			...prev,
			[key]: ((bot.params.get(key) as string) || "").toLowerCase(),
		}),
		{}
	) as Record<string, string>

	const labels = {
		"first_name": "first name",
		"last_name": "last name",
		"email": "email",
		"company": "company",
	} as Record<string, string>
	for (const key in values) {
		if (!values[key]) throw new Error(`missing ${labels[key]}`)
	}

	// Save the lead in our leads collection
	bot.asAdmin.save("uesio/crm.lead", [{
			"uesio/crm.firstname": values["first_name"],
			"uesio/crm.lastname": values["last_name"],
			"uesio/crm.email": values["email"],
			"uesio/crm.account": values["company"],
	} as unknown as WireRecord])

	// Send an email to the user
	const salesEmail = bot.asAdmin.getConfigValue("uesio/crm.sales_email")
	const templateIdUser = bot.asAdmin.getConfigValue(
		"uesio/web.email_template_demo_to_user"
	)
	const templateIdSales = bot.asAdmin.getConfigValue(
		"uesio/web.email_template_demo_to_sales"
	)

	// // Email to user
	bot.asAdmin.runIntegrationAction("uesio/crm.sendgrid", "sendEmail", {
		to: [values["uesio/crm.email"]],
		from: salesEmail,
		templateId: templateIdUser,
	})

	// // Email to us
	bot.asAdmin.runIntegrationAction("uesio/crm.sendgrid", "sendEmail", {
		to: [salesEmail],
		from: salesEmail,
		templateId: templateIdSales,
		dynamicTemplateData: {
			firstname: values["first_name"],
			lastname: values["last_name"],
			email: values["email"],
			account: values["company"],
		},
	})
}
