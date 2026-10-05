// Keep keywords broad so titles like "Computer Networks Tutorial" match.
export function getTopicThumbnail(topicLike: string | undefined) {
  if (!topicLike) return null
  const key = topicLike.toLowerCase()

  // Programming languages & stacks
  if (/(^|\s)python(\s|$)/.test(key)) return "/images/topics/python.png"
  if (/javascript|js\b/.test(key)) return "/images/topics/javascript.png"
  if (/(^|\s)java(\s|$)/.test(key)) return "/images/topics/java.png"
  if (/react(\.js)?/.test(key)) return "/images/topics/react.png"
  if (/node(\.js)?/.test(key)) return "/images/topics/node.png"

  // Data & ML
  if (/oracle|sql|postgres|mysql|sqlite|database/.test(key)) return "/images/topics/sql.png"
  if (/machine learning|deep learning|neural|ml\b/.test(key)) return "/images/topics/machine-learning.png"
  if (/data\s*science|analytics/.test(key)) return "/images/topics/data-science.png"

  // DevOps
  if (/docker/.test(key)) return "/images/topics/docker.png"
  if (/kubernetes|k8s/.test(key)) return "/images/topics/kubernetes.png"

  // CS/networking
  if (/network|tcp|udp|computer\s*network/.test(key)) return "/images/topics/networking.png"

  // Tools
  if (/git|github|version control/.test(key)) return "/images/topics/git.png"

  return null
}
