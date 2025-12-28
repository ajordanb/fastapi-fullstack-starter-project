import {useState} from "react";

const [copiedField, setCopiedField] = useState<string | null>(null)

const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }