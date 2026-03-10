import { randomUUID } from "crypto";

export const createPrefixedId = (prefix: string): string => `${prefix}${randomUUID()}`;
