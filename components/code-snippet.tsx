'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown } from 'lucide-react'

type Language = 'javascript' | 'python' | 'curl' | 'go' | 'ruby' | 'php' | 'java' | 'swift' | 'kotlin'

interface CodeSnippetProps {
  method: string
  url: string
  headers?: Record<string, string>
  body?: string
}

const languages: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'curl', label: 'cURL' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'java', label: 'Java' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
]

export default function CodeSnippet({ method, url, headers = {}, body }: CodeSnippetProps) {
  const [language, setLanguage] = useState<Language>('javascript')
  const [copied, setCopied] = useState(false)

  const generateCode = (lang: Language): string => {
    const headerEntries = Object.entries(headers)
    const headerString = headerEntries
      .map(([key, value]) => `    "${key}": "${value}"`)
      .join(',\n')

    switch (lang) {
      case 'javascript':
        return `const fetch${method} = async () => {
  try {
    const response = await fetch("${url}", {
      method: "${method}",
      headers: {
${headerString || '        "Content-Type": "application/json"'}
      }${body ? `,
      body: JSON.stringify(${body})` : ''}
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};

fetch${method}();`

      case 'python':
        return `import requests

url = "${url}"
headers = {
${headerEntries.map(([k, v]) => `    "${k}": "${v}"`).join(',\n') || '    "Content-Type": "application/json"'}
}${body ? `
payload = ${body}` : ''}

response = requests.${method.toLowerCase()}(url, headers=headers${body ? ', json=payload' : ''})
print(response.json())`

      case 'curl':
        let curl = `curl -X ${method} "${url}"`
        headerEntries.forEach(([key, value]) => {
          curl += ` \\\n  -H "${key}: ${value}"`
        })
        if (body) {
          curl += ` \\\n  -d '${body}'`
        }
        return curl

      case 'go':
        return `package main

import (
	"bytes"
	"fmt"
	"net/http"
)

func main() {
	url := "${url}"
${body ? `\tpayload := []byte(\`${body}\`)` : ''}
	
	req, err := http.NewRequest("${method}", url, ${body ? 'bytes.NewBuffer(payload)' : 'nil'})
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
${headerEntries.map(([k, v]) => `\treq.Header.Add("${k}", "${v}")`).join('\n')}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	fmt.Println("Response:", resp.Status)
}`

      case 'ruby':
        return `require 'net/http'
require 'uri'

url = URI.parse("${url}")
http = Net::HTTP.new(url.host, url.port)

request = Net::HTTP::${method}.new(url)${headerEntries.map(([k, v]) => `
request["${k}"] = "${v}"`).join('')}

${body ? `request.body = ${JSON.stringify(body)}` : ''}

response = http.request(request)
puts response.read_body`

      case 'php':
        return `<?php

$url = "${url}";
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);${headerEntries.map(([k, v]) => `
curl_setopt($ch, CURLOPT_HTTPHEADER, array("${k}: ${v}"));`).join('')}

${body ? `curl_setopt($ch, CURLOPT_POSTFIELDS, '${body}');` : ''}

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`

      case 'java':
        return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        String url = "${url}";
        
        HttpClient client = HttpClient.newHttpClient();
        
        HttpRequest.Builder builder = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .method("${method}", ${body ? 'HttpRequest.BodyPublishers.ofString("' + body.replace(/"/g, '\\"') + '")' : 'HttpRequest.BodyPublishers.noBody()'});
${headerEntries.map(([k, v]) => `        builder.header("${k}", "${v}");`).join('\n')}
        
        HttpRequest request = builder.build();
        
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println(response.body());
    }
}`

      case 'swift':
        return `import Foundation

let url = URL(string: "${url}")!
var request = URLRequest(url: url)
request.httpMethod = "${method}"${headerEntries.map(([k, v]) => `
request.setValue("${v}", forHTTPHeaderField: "${k}")`).join('')}

${body ? `request.httpBody = """
${body}
""".data(using: .utf8)` : ''}

let task = URLSession.shared.dataTask(with: request) { data, response, error in
    if let error = error {
        print("Error:", error)
        return
    }
    
    if let data = data {
        print(String(data: data, encoding: .utf8)!)
    }
}

task.resume()`

      case 'kotlin':
        return `import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

fun main() {
    val url = "${url}"
    
    val client = HttpClient.newHttpClient()
    
    val builder = HttpRequest.newBuilder()
        .uri(URI.create(url))
        .method("${method}", ${body ? 'HttpRequest.BodyPublishers.ofString("""${body}""")' : 'HttpRequest.BodyPublishers.noBody()'})
${headerEntries.map(([k, v]) => `        .header("${k}", "${v}")`).join('\n')}
    
    val request = builder.build()
    
    val response = client.send(request, HttpResponse.BodyHandlers.ofString())
    
    println(response.body())
}`

      default:
        return '// Select a language'
    }
  }

  const code = generateCode(language)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-bg-tertiary border border-default rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-default bg-bg-secondary">
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="appearance-none bg-bg-tertiary border border-default rounded-lg px-4 py-2 pr-10 text-sm text-text-primary focus:outline-none focus:border-accent-primary cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-bg-secondary">
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-text-muted" />
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-muted hover:text-text-primary transition-default"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-accent-success" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-text-primary whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  )
}
