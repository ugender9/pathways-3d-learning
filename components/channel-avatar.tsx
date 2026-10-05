"use client"

import { useState } from "react"

interface ChannelAvatarProps {
  channelTitle: string
  channelId?: string
  size?: number
}

// Generate a deterministic hue from the channel name for a unique avatar color
function hueFromName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

export function ChannelAvatar({ channelTitle, channelId, size = 32 }: ChannelAvatarProps) {
  const [imgError, setImgError] = useState(false)

  const hue = hueFromName(channelTitle)
  const bg = `hsl(${hue}, 65%, 50%)`
  const abbr = initials(channelTitle) || "YT"

  // YouTube returns channel avatars at this URL pattern if we have channelId
  const ytAvatarUrl = channelId
    ? `https://yt3.googleusercontent.com/ytc/${channelId}=s${size * 2}-c-k-c0x00ffffff-no-rj`
    : null

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden shrink-0 ring-2 ring-white/80 shadow-md"
    >
      {ytAvatarUrl && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ytAvatarUrl}
          alt={channelTitle}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          style={{ background: bg, width: size, height: size, fontSize: size * 0.35 }}
          className="flex items-center justify-center font-bold text-white select-none"
        >
          {abbr}
        </div>
      )}
    </div>
  )
}
