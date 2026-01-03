# ReactRoof

Efficient React HTML head manager for SEO and social media sharing. Use `ReactRoof` to manage your document head, including titles, meta tags, scripts, and structured data, with a dedicated SEO component for simplified social card generation.

## Features

- **Lightweight & Fast**: Designed for modern React applications.
- **Component-Based**: Manage your `<head>` tags using standard React components.
- **SEO Ready**: Includes a dedicated `<SEO />` component for easy Open Graph, Twitter Card, and JSON-LD management.
- **Type Safe**: Built with TypeScript for excellent autocomplete and validation.
- **Standard API**: Supports `<title>`, `<meta>`, `<link>`, and `<script>` tags directly.
- **Nested Support**: Child components can override parent tags ("Last one wins" strategy).

## Installation

```bash
npm install react-roof
# or
yarn add react-roof
# or
pnpm add react-roof
```

## Basic Usage

Wrap your application in `RoofProvider`, then use the `<Head>` component anywhere in your component tree.

```tsx
import { RoofProvider, Head } from "react-roof";

function App() {
  return (
    <RoofProvider>
      <HomePage />
    </RoofProvider>
  );
}

function HomePage() {
  return (
    <>
      <Head>
        <title>My Awesome App</title>
        <meta name="description" content="This is the home page" />
      </Head>
      <h1>Welcome Home</h1>
    </>
  );
}
```

## The `<SEO />` Component

For most pages, you want to set standard social sharing tags without repetitive boilerplate. Use the `<SEO />` component for this.

```tsx
import { SEO } from "react-roof";

function BlogPost() {
  return (
    <SEO
      title="Understanding React Hooks"
      description="A deep dive into useState and useEffect."
      image="https://example.com/hooks-cover.jpg"
      type="article"
      twitter={{
        card: "summary_large_image",
        site: "@mydevblog",
      }}
    />
  );
}
```

### Supported Props

| Prop          | Type                 | Description                                                           |
| ------------- | -------------------- | --------------------------------------------------------------------- |
| `title`       | `string`             | Sets `<title>`, `og:title`, and `twitter:title`.                      |
| `description` | `string`             | Sets `meta description`, `og:description`, and `twitter:description`. |
| `image`       | `string` \| `object` | Sets `og:image`. Supports object for `width`, `height`, `alt`.        |
| `url`         | `string`             | Sets canonical `og:url`.                                              |
| `type`        | `string`             | Sets `og:type` (default: "website"). Support "article", "video", etc. |
| `twitter`     | `object`             | Customize Twitter card specific fields (`card`, `site`, `creator`).   |
| `jsonLd`      | `object` \| `array`  | Automatically injects safe JSON-LD structured data scripts.           |

### Advanced Usage: Articles & JSON-LD

```tsx
<SEO
  // ... basic props
  type="article"
  article={{
    publishedTime: "2024-01-01T12:00:00Z",
    author: ["Jane Doe"],
    tags: ["React", "JavaScript"],
  }}
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Understanding React Hooks",
    author: {
      "@type": "Person",
      name: "Jane Doe",
    },
  }}
/>
```

## Component API

### `<Head>`

The core component that portals its children to `document.head`.

- Supports standard HTML tags: `<title>`, `<meta>`, `<link>`, `<script>`.
- Duplicate tags are handled automatically (last rendered wins for unique keys).
- Updates are applied synchronously on render/mount.

```tsx
<Head>
  <title>Raw Control</title>
  <meta name="theme-color" content="#000000" />
  <link rel="canonical" href="https://custom.url" />
  <script src="https://analytics.example.com/js" async />
</Head>
```

## Principles

1.  **Deduplication**: Tags like `<title>` or `<meta name="description">` are unique. If multiple components render them, the one deepest in the React tree (or rendered last) wins.
2.  **Aggregation**: Tags like `article:tag` or `og:image` can appear multiple times. `ReactRoof` aggregates them properly.
3.  **Cleanup**: When a component unmounts, its tags are removed, and the `<head>` reverts to the state defined by the remaining parent components.

## License

MIT
