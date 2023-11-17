import { ListenerBotApi, WireRecord } from "@uesio/bots"
function request(bot: ListenerBotApi) {
	const fields = [
		"first_name",
		"last_name",
		"email",
		"company",
		"no_employees",
		"location",
		"description",
		"source",
	]

	const values = fields.reduce(
		(prev, key) => ({
			...prev,
			[key]: ((bot.params.get(key) as string) || "").toLowerCase(),
		}),
		{}
	) as Record<string, string>

	const labels = {
		first_name: "first name",
		last_name: "last name",
		email: "email",
		description: "description",
	} as Record<string, string>

	// for (const key in values) {
	// 	if (
	// 		values[key] === "" &&
	// 		values[key] !== "no_employees" &&
	// 		values[key] !== "company"
	// 	)
	// 		throw new Error(`missing ${labels[key]}`)
	// }

	// Save the lead in our leads collection
	bot.asAdmin.save("uesio/crm.lead", [
		{
			"uesio/crm.firstname": values.first_name,
			"uesio/crm.lastname": values.last_name,
			"uesio/crm.email": values.email,
			"uesio/crm.account": values.company,
			"uesio/crm.no_employees": Number(values.no_employees),
			"uesio/crm.location": values.country,
			"uesio/crm.description": values.description,
			"uesio/web.source": values.source,
			"uesio/crm.status": "OPEN",
		} as unknown as WireRecord,
	])

	// return

	// Send an email to the user
	const salesEmail = bot.asAdmin.getConfigValue("uesio/crm.sales_email")
	const userConfigValue =
		values["source"] === "contact request"
			? "uesio/web.email_template_contact_to_user"
			: "uesio/web.email_template_demo_to_user"

	const SalesConfigValue =
		values["source"] === "contact request"
			? "uesio/web.email_template_contact_to_sales"
			: "uesio/web.email_template_demo_to_sales"

	const templateIdUser = bot.asAdmin.getConfigValue(userConfigValue)
	const templateIdSales = bot.asAdmin.getConfigValue(SalesConfigValue)

	// // Email to user
	bot.asAdmin.runIntegrationAction("uesio/crm.sendgrid", "sendemail", {
		to: [values.email],
		from: salesEmail,
		templateId: templateIdUser,
		dynamicTemplateData: {
			firstname: values["first_name"],
			lastname: values["last_name"],
			email: values["email"],
			account: values["company"],
			no_employees: values["no_employees"],
			country: values["country"],
			description: values["description"],
			source: values["source"],
		},
	})

	// // Email to us
	bot.asAdmin.runIntegrationAction("uesio/crm.sendgrid", "sendemail", {
		to: [salesEmail],
		from: salesEmail,
		templateId: templateIdSales,
		dynamicTemplateData: {
			firstname: values["first_name"],
			lastname: values["last_name"],
			email: values["email"],
			account: values["company"],
			no_employees: values["no_employees"],
			country: values["country"],
			description: values["description"],
			source: values["source"],
		},
	})
}
