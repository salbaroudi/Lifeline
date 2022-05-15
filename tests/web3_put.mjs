/* Modified from: https://web3.storage/docs/#next-steps
*/

import { Web3Storage, getFilesFromPath } from 'web3.storage'

async function main () {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxZEI5M0UxNmUxQkEzNTYyRTZCMENBZjJiMWRhOGYxRDVBRTU4MTYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIwOTUxOTczNjAsIm5hbWUiOiJTdGFydFRva2VuIn0.jRBEYSaOi2htHA-DbAKh067QNOYlTFer0-4C8gZTqwo"

  const storage = new Web3Storage({ token })

  console.log("Storage Object =" + storage)

  const pathArr = ["./fileuploads/blossoms_small.jpg", "./fileuploads/hello1.txt"]
  const files = []

  for (const path of pathArr) {
      const pathFiles = await getFilesFromPath(path)
      files.push(...pathFiles)
    }

  const cid = await storage.put(files)
  console.log('Content added with CID:', cid)
}

main()
