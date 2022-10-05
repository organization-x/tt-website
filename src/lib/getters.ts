// This file hold functions used inside +page.server.ts files and API endpoints.
// All these functions are getters, the setters are in their respective API endpoints

import { prisma } from "$lib/prisma";

import type { Prisma } from "@prisma/client";

export const getUsers = (where: Prisma.UserWhereInput) =>
	prisma.user.findMany({
		where,
		include: {
			links: {
				select: {
					userId: false,
					Devto: true,
					Facebook: true,
					GitHub: true,
					LinkedIn: true,
					Twitter: true,
					Website: true
				}
			},
			pinnedProject: true
		}
	});

export const getProjects = (where: Prisma.ProjectWhereInput) =>
	prisma.project
		.findMany({
			where,
			include: {
				authors: { select: { user: true, position: true } }
			}
		})
		.then((projects) => projects);
