<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
          h1 { font-size: 22px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 14px; }
          th { background: #f3f4f6; text-align: left; }
          tr:nth-child(even) { background: #f9fafb; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .note { margin: 8px 0 16px; color: #6b7280; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <div class="note">This is an HTML view of the sitemap for easier reading. Search engines read the XML directly.</div>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="s:urlset/s:url">
              <tr>
                <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                <td><xsl:value-of select="s:lastmod" /></td>
                <td><xsl:value-of select="s:changefreq" /></td>
                <td><xsl:value-of select="s:priority" /></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
