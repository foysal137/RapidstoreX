const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

const target = `                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-blue-600 font-mono"
                              />`;
                              
const normalizedCode = code.replace(/\r\n/g, '\n');
const replacement = `                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-blue-600 font-mono mb-2"
                              />
                              <div className="relative">
                                <input 
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const r = new FileReader();
                                      r.onloadend = () => {
                                         const newStore = { ...storeState };
                                         newStore.mustHaveCollections[idx].image = r.result as string;
                                         updateGlobalState(newStore);
                                      };
                                      r.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <button type="button" className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-xl font-bold text-xs pointer-events-none w-full">
                                  Upload Image Instead
                                </button>
                              </div>`;

const newCode = normalizedCode.replace(target, replacement);
fs.writeFileSync('src/pages/AdminPanel.tsx', newCode);
console.log(newCode !== normalizedCode ? "Replaced ok" : "Failed to replace");
