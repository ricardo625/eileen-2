import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpRight, SendHorizontal } from 'lucide-react'

const suggestions = [
  { text: 'How many submissions did we get this week?' },
  { text: 'Show me my last 10 submissions' },
  { text: "What's the compliance rate by banner?" },
]

const FULL_TEXT = "Hi! I'm Eileen."
const SPLIT = 7
const PLAIN_CHARS = FULL_TEXT.slice(0, SPLIT).split('')
const GRADIENT_CHARS = FULL_TEXT.slice(SPLIT).split('')

// Interpolate between #ffc4b6 and #d1c2e9 per character position
function gradientColor(i: number, total: number) {
  const t = total > 1 ? i / (total - 1) : 0
  const r = Math.round(255 + (209 - 255) * t)
  const g = Math.round(196 + (194 - 196) * t)
  const b = Math.round(182 + (233 - 182) * t)
  return `rgb(${r},${g},${b})`
}

function useTypewriter(total: number, speed = 80) {
  const [count, setCount] = useState(0)
  const ref = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (count >= total) return
    ref.current = setTimeout(() => setCount(c => c + 1), speed)
    return () => clearTimeout(ref.current)
  }, [count, total, speed])

  return count
}

export function AiLeanPage() {
  const count = useTypewriter(FULL_TEXT.length)
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col gap-[22px] items-center w-[639px]">
      {/* Heading */}
      <h1 className="font-sans font-medium text-4xl leading-none text-center whitespace-nowrap tracking-tight">
        <span className="text-foreground">
          {PLAIN_CHARS.map((char, i) => (
            <span
              key={i}
              style={{
                opacity: count > i ? 1 : 0,
                transition: count > i ? 'opacity 300ms ease-out' : 'none',
              }}
            >
              {char}
            </span>
          ))}
        </span>
        {GRADIENT_CHARS.map((char, i) => {
          const idx = SPLIT + i
          return (
            <span
              key={i}
              style={{
                color: gradientColor(i, GRADIENT_CHARS.length),
                opacity: count > idx ? 1 : 0,
                transition: count > idx ? 'opacity 300ms ease-out' : 'none',
              }}
            >
              {char}
            </span>
          )
        })}
      </h1>

      {/* Input area */}
      <div className="flex flex-col gap-2.5 w-full">
        <div className="p-px rounded-lg bg-gradient-to-br from-[#c5eaf5] to-[#f5d0e8] dark:from-[#c5eaf5]/20 dark:to-[#f5d0e8]/20 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
          <div className="bg-background flex gap-1 h-[86px] items-start overflow-hidden p-4 rounded-[9px] w-full">
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Ask about your data"
              className="flex-1 font-sans font-normal text-sm leading-5 text-foreground placeholder:text-muted-foreground min-w-0 resize-none bg-transparent outline-none h-full"
            />
            <button
              disabled={!value.trim()}
              className={cn(
                'flex items-center justify-center rounded-full size-9 shrink-0 transition-opacity',
                value.trim()
                  ? 'bg-primary opacity-100 hover:opacity-80'
                  : 'bg-primary opacity-50 cursor-not-allowed'
              )}
            >
              <SendHorizontal className="size-4 text-primary-foreground" />
            </button>
          </div>
        </div>
        <p className="font-sans text-xs text-muted-foreground text-center w-full leading-none">
          Press ENTER to send.&nbsp;&nbsp;Press ENTER + SHIFT for new line.
        </p>
      </div>

      {/* Suggested prompts */}
      <div className="flex flex-col w-full pt-4">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="group flex items-center gap-3 h-11 px-4 rounded-full w-full text-left transition-colors hover:bg-accent"
          >
            <span className="flex-1 font-poppins font-medium text-sm leading-5 text-muted-foreground">
              {s.text}
            </span>
            <span className="size-6 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="size-5 text-muted-foreground" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
