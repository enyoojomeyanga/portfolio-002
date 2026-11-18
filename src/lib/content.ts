/** Illustrative editorial content only. Not verified client material. */
export type WorldKey = "engineering" | "graphics" | "visibility";
export interface World {
  key: WorldKey;
  index: string;
  eyebrow: string;
  heading: string;
  description: string;
  linkLabel: string;
}
export const worlds: readonly World[] = [
  { key: "engineering", index: "01", eyebrow: "Software Engineering", heading: "Systems & thinking", description: "[CLIENT PROJECTS] Technical work will be documented here with authentic evidence and project context.", linkLabel: "Enter Engineering" },
  { key: "graphics", index: "02", eyebrow: "Graphics Design", heading: "Form & intention", description: "[CLIENT ARTWORK] A gallery of verified visual projects, supported by the story behind each piece.", linkLabel: "Enter Graphics" },
  { key: "visibility", index: "03", eyebrow: "Local Business Visibility", heading: "Clarity & presence", description: "[CONFIRMED SERVICES] Accurate service scopes, requirements and limitations will appear here.", linkLabel: "Enter Visibility" }
] as const;
export const displayName = "[CLIENT NAME]";
