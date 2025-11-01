import { Role } from "../interfaces/common";
import { User } from "../modules/user/user.model";

interface UsersWithAggregateOptions {
	role: Role;
	query: {
		page?: string;
		limit?: string;
		phone?: string;
		email?: string;
		name?: string;
		search?: string;
	};
}

export async function usersWithAggregate({ role, query }: UsersWithAggregateOptions) {
	const { phone, email, name, search } = query;

	// Pagination setup
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 20;
	const skip = (page - 1) * limit;

	// Filtering setup
	const match: Record<string, unknown> = { role };
	if (search && search.trim()) {
		const s = search.trim();
		match.$or = [{ phone: { $regex: s, $options: "i" } }, { email: { $regex: s, $options: "i" } }, { name: { $regex: s, $options: "i" } }];
	}
	if (phone && phone.trim()) {
		match.phone = { $regex: phone.trim(), $options: "i" };
	}
	if (email && email.trim()) {
		match.email = { $regex: email.trim(), $options: "i" };
	}
	if (name && name.trim()) {
		match.name = { $regex: name.trim(), $options: "i" };
	}

	// Aggregation pipeline with $facet for pagination + meta
	const result = await User.aggregate([
		{ $match: match },
		{
			$lookup: {
				from: "wallets",
				localField: "_id",
				foreignField: "userId",
				as: "wallet",
			},
		},
		{
			$lookup: {
				from: "transactions",
				localField: "_id",
				foreignField: "userId",
				as: "transactions",
			},
		},
		{
			$addFields: {
				balance: { $first: "$wallet.balance" },
				transactionCount: { $size: "$transactions" },
				lastActive: { $max: "$transactions.createdAt" },
			},
		},
		{
			$project: {
				_id: 0,
				id: "$_id",
				name: 1,
				email: 1,
				address: 1,
				isEmailVerified: 1,
				balance: 1,
				transactionCount: 1,
				phone: 1,
				status: "$isActive",
				lastActive: { $dateToString: { format: "%d %B %Y", date: "$lastActive" } },
				joinDate: { $dateToString: { format: "%d %B %Y", date: "$createdAt" } },
			},
		},
		{
			$facet: {
				data: [{ $skip: skip }, { $limit: limit }],
				totalCount: [{ $count: "total" }],
			},
		},
	]);

	const data = result[0]?.data || [];
	const totalDocuments = result[0]?.totalCount?.[0]?.total || 0;
	const totalPages = Math.ceil(totalDocuments / limit);

	return {
		data,
		meta: {
			total: totalDocuments,
			page,
			limit,
			totalPages,
		},
	};
}
