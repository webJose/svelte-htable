# svelte-htable

This is a hierarchical table component for Svelte.  This means that it is a table that may be provided with items that 
contain items, and said contained items need to be displayed as a sub-table.  The process can be repeated, producing 
an indefinite amount of nested tables.  An image is worth a thousand words:

![svelte-htable example](example.png)

The styling shown in the example is not provided in the component itself.  It must be provided by assigning a CSS 
class to the table.  Furthermore, inner tables don't inherit the CSS class, so use the `` prop to specify inner table 
styling.

## Quickstart

2do

## Features

1. It is a recursive component.
2. Sub-tables can show a path and a level on top of it (using the `<caption>` element).
3. Sub-tables can have a different CSS class applied to them than the class applied to the top table.
4. It can group items so all items with sub-items are grouped together either before or after the simple items.

## Styling the Table

Simply apply the `class` HTML attribute to the table to style the level-1 (or top) table.  To style sub-tables, pass 
2do the class names via the `xx` prop.

The collapsable element is just a `<details>` HTML element, and can be styled by targetting it using the class as 
anchor for the CSS selector:

```css
.table-class details {
    /* style the details element here */
}
```

Other more specific and imaginative selectors can be used.
