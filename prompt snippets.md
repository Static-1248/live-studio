# 提示语模板

copilot chat -> copilot edit:

```markdown
(上文)

如果可以，你需要指示另一个AI完成这个任务，请分步列出若干简短、明确的步骤指示，无需给出代码。
```


分步实现：在保存按钮旁边显示一个“✔已保存！”的提示，并且该提示会在2秒后自动淡出。

1. **添加 CSS 动画**：
   - 在 `<style>` 标签中添加一个类，用于处理保存提示的显示和淡出效果。
   - 定义一个 `.save-notification` 类，设置初始 `opacity` 为 0，并添加 `transition` 属性。
   - 定义一个 `.save-notification.show` 类，设置 `opacity` 为 1。

2. **更新模板**：
   - 在保存按钮旁边添加一个 `div` 元素，用于显示保存提示。
   - 为 `div` 元素添加 `ref` 属性，以便在 JavaScript 中引用它。
   - 确保保存按钮和保存提示 `div` 在相应的保存区域内。

3. **修改保存函数**：
   - 在 `saveTtyRecord` 和 `saveIntroRecord` 函数中，获取保存提示 `div` 的引用。
   - 移除保存提示 `div` 的 `show` 类。
   - 触发重绘（通过访问 `offsetWidth` 属性）。
   - 添加保存提示 `div` 的 `show` 类。