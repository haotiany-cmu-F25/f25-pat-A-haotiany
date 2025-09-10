# Copilot Cheat Sheet

## **Copilot Mode Tips**  
- Use **Agent mode** for tasks that span multiple files, branches, or require repo-level changes.
- Attach context: go to the most relevant file, and attach other relevant files to the prompt for Copilot to consider. If the whole project should be considered, try @workspace. 
- Use **at `@` to specify a specific extension to help Copilot.
- Add **`/` commands** to further specify a direct action or workflow you want Copilot to execute.

---

## **Ask Mode**
- **Purpose:** Get instant code answers, explanations, or snippets in response to short questions. When you don't know something, use Copilot's Ask mode instead of a Google or Stackoverflow search. 

---

## **Edit Mode**
- **Purpose:** Directly modify code (refactor, fix, document) using AI.

---

## **Agent Mode**
- **Purpose:** Delegate complex, multi-step tasks to Copilot Coding Agent, which can perform actions (e.g., code changes, branch operations, PR creation) across your repo.
- **Capabilities:**  
  - Performs multi-step coding tasks (refactoring, bug fixing, documentation, etc.).
  - Can create branches, push changes, open pull requests.
  - Handles tasks that require deeper repo context, not just inline code changes.
  - Can figure out and execute terminal commands. 

---

## Embellishing Prompts with Starters: Adding **Context (`#`), Extension (`@`), Command (`/`)** 

- **Hashtag `#`: Attach context (can be any file or setting), can also use "Add Context"
- **Slash `/`**: Used to trigger specific actions or workflows. Type `/ ` in the prompt window to see available actions. Often used with an `@` command to specify the context or target assistant (subagent). 
- ** At `@`**: Used to mention specific assistant or extension directly, helpful when you want to be explicit and multiple assistants can help with similar actions

When in doubt, omit starters. Many goals can be achieved in multiple modes, with or without any starters, with similar effects. 

Common prompt starters are:

 - `@workspace` – Describe something that you want to do in the current project when the goal needs the whole project.
- `@workspace /explain` – Explain code or concepts.
- `@workspace /tests` – Generate unit tests.
- `@workspace /fix` – Fix bugs.
-  `@vscode /search` – Search the workspace.
-  `@terminal` – Do something in the terminal.
-  `@terminal /explain` – Explain something in the terminal.
