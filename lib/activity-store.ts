import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "activity.json");

export interface Activity {
  userId: string;
  message: string;
  time: number;
}

export function getActivity(): Activity[] {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function logActivity(activity: Activity) {
  const logs = getActivity();
  logs.unshift(activity);
  fs.writeFileSync(filePath, JSON.stringify(logs.slice(0, 50), null, 2));
}
