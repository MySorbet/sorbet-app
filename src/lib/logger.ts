import { config } from "@/lib/config";

/**
 * A logger function that will only logs on development
 * @param object - The object to log
 * @param comment - Autogenerated with `lg` snippet
 */
export default function logger(object: unknown, comment?: string): void {
  if (!config.showLogger) return;

  console.log(
    '%c ============== INFO LOG \n',
    'color: #22D3EE',
    `${typeof window !== 'undefined' && window?.location.pathname}\n`,
    `=== ${comment ?? ''}\n`,
    object
  );
}
