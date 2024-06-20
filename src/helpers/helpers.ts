export const lowercase = (text: string) => text.toLowerCase();

export const getBlobName = (name: string) => name.match(/\/([^/?#]+)$/)![1];
