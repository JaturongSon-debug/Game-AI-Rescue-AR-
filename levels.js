/**
 * levels.js - Expanded 10 Levels Machine, PPE Selection, Dynamic AR Hazards, Precision Scoring
 */

class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.levelComplete = false;
    this.score = 100; // Accuracy Score (0 - 100) per level
    this.totalScore = 0;
    this.starCount = 3;

    // 10 Levels State Definitions
    this.state = {
      // L1: PPE Gloves & Boots
      l1: { ppeGloves: false, ppeBoots: false },

      // L2: Unplug
      l2: { plugX: 0, plugY: 0, socketX: 0, socketY: 0, isPlugged: true },

      // L3: Cut-Out Breaker
      l3: { breakerX: 0, breakerY: 0, handleY: 0, isPowerOn: true },

      // L4: Rubber Mat
      l4: { matX: 0, matY: 0, targetX: 0, targetY: 0, isMatPlaced: false },

      // L5: Moving Live Wire Hook
      l5: { wireX: 0, wireY: 0, phase: 0, isWireOff: false },

      // L6: Unhook Belt from Frame
      l6: { hookX: 0, hookY: 0, victimBeltX: 0, victimBeltY: 0, isUnhooked: false },

      // L7: Relocate Victim to Safe Dry Area
      l7: { victimX: 0, victimY: 0, safeX: 0, safeY: 0, isRelocated: false },

      // L8: Dial Hotline 1129
      l8: { phoneDialed: "", isDialed: false },

      // L9: Airway Check & Tap Shoulder
      l9: { shoulderTaps: 0, chinTilted: false },

      // L10: CPR Rhythm & Defibrillator
      l10: { cprCount: 0, targetCPR: 10, isCPRBeatActive: false, lastCompressionTime: 0 }
    };

    this.levelInfo = [
      {
        title: "ด่านที่ 1: ตรวจเช็กและสวมอุปกรณ์ PPE (Safety Gear)",
        desc: "สวมถุงมือยางฉนวนไฟฟ้าและรองเท้าเซฟตี้ฉนวนไฟฟ้าก่อนเข้าช่วยเหลือ",
        speech: "ด่านที่หนึ่ง หนีบเลือกถุงมือยางฉนวนและรองเท้าฉนวนไฟฟ้าเพื่อความปลอดภัย"
      },
      {
        title: "ด่านที่ 2: ปลดปลั๊กไฟ (Unplug Safely)",
        desc: "ดึงปลั๊กไฟเครื่องใช้ไฟฟ้าออกจากเต้ารับด้วยความระมัดระวัง",
        speech: "ด่านที่สอง ดึงปลั๊กไฟออกจากเต้ารับ"
      },
      {
        title: "ด่านที่ 3: สับคัทเอาท์หลัก (Main Breaker Cut-Out)",
        desc: "โยกสวิตช์คัทเอาท์หลักลงเพื่อตัดกระแสไฟฟ้าทั้งบ้าน",
        speech: "ด่านที่สาม สับคัทเอาท์ลงด้านล่างเพื่อตัดไฟหลัก"
      },
      {
        title: "ด่านที่ 4: ปูแผ่นยางฉนวนกันไฟรั่ว (Lay Rubber Mat)",
        desc: "ลากแผ่นยางฉนวนปูบนพื้นเปียกบริเวณใกล้ตัวผู้ป่วย",
        speech: "ด่านที่สี่ ปูแผ่นยางฉนวนลงบนพื้นเปียกเพื่อป้องกันไฟฟ้าช็อต"
      },
      {
        title: "ด่านที่ 5: เขี่ยสายไฟที่มีไฟส่ายไปมา (Moving Wire Hook)",
        desc: "ใช้ไม้ตะขอฉนวนเขี่ยสายไฟที่ส่ายและเกิดประกายไฟออกจากผู้ป่วย",
        speech: "ด่านที่ห้า ใช้ไม้ฉนวนเขี่ยสายไฟที่ส่ายออกจากตัวผู้ป่วย"
      },
      {
        title: "ด่านที่ 6: ปลดผู้ป่วยออกจากโครงเหล็ก (Unhook Victim)",
        desc: "ใช้ไม้ตะขอฉนวนเกี่ยวเข็มขัดผู้ป่วยออกจากโครงเหล็กที่มีกระแสไฟรั่ว",
        speech: "ด่านที่หก เกี่ยวเข็มขัดปลดผู้ป่วยออกจากโครงเหล็กมีไฟรั่ว"
      },
      {
        title: "ด่านที่ 7: ย้ายผู้ป่วยไปยังเขตปลอดภัย (Relocate to Safe Zone)",
        desc: "ลากผู้ป่วยออกจากบริเวณ 위험 ไปยังเขตแห้งปลอดภัย",
        speech: "ด่านที่เจ็ด ลากตัวผู้ป่วยไปยังเขตแห้งปลอดภัย"
      },
      {
        title: "ด่านที่ 8: โทรสายด่วน PEA 1129 (Dial Emergency)",
        desc: "กดโทรสายด่วน 1129 บนแป้นโทรศัพท์ AR เพื่อแจ้งเหตุฉุกเฉิน",
        speech: "ด่านที่แปด กดโทรสายด่วน 1 1 2 9"
      },
      {
        title: "ด่านที่ 9: ตบไหล่เรียกและเปิดทางเดินหายใจ (Airway Check)",
        desc: "ตบไหล่ผู้ป่วย 3 ครั้งเพื่อประมวลการรู้สึกตัว และเชยคางเปิดทางเดินหายใจ",
        speech: "ด่านที่เก้า ตบไหล่ผู้ป่วยสามครั้งและเชยคางขึ้นเปิดทางเดินหายใจ"
      },
      {
        title: "ด่านที่ 10: ปั๊มหัวใจ CPR (100-120 BPM Beat)",
        desc: "ปั๊มหัวใจตามจังหวะสัญญาณไฟ 10 ครั้งเพื่อช่วยชีวิตผู้ป่วย",
        speech: "ด่านที่สิบ ปั๊มหัวใจตามจังหวะสัญญาณไฟเพื่อช่วยชีวิต"
      }
    ];
  }

  initLevel(levelNum, canvasWidth, canvasHeight) {
    this.currentLevel = levelNum;
    this.levelComplete = false;
    this.score = 100;

    const w = canvasWidth;
    const h = canvasHeight;

    if (levelNum === 1) {
      this.state.l1.ppeGloves = false;
      this.state.l1.ppeBoots = false;
    } else if (levelNum === 2) {
      this.state.l2.socketX = w * 0.7;
      this.state.l2.socketY = h * 0.45;
      this.state.l2.plugX = w * 0.7;
      this.state.l2.plugY = h * 0.45;
      this.state.l2.isPlugged = true;
    } else if (levelNum === 3) {
      this.state.l3.breakerX = w * 0.5;
      this.state.l3.breakerY = h * 0.3;
      this.state.l3.handleY = h * 0.35;
      this.state.l3.isPowerOn = true;
    } else if (levelNum === 4) {
      this.state.l4.matX = w * 0.15;
      this.state.l4.matY = h * 0.75;
      this.state.l4.targetX = w * 0.45;
      this.state.l4.targetY = h * 0.65;
      this.state.l4.isMatPlaced = false;
    } else if (levelNum === 5) {
      this.state.l5.wireX = w * 0.45;
      this.state.l5.wireY = h * 0.55;
      this.state.l5.phase = 0;
      this.state.l5.isWireOff = false;
    } else if (levelNum === 6) {
      this.state.l6.hookX = w * 0.2;
      this.state.l6.hookY = h * 0.4;
      this.state.l6.victimBeltX = w * 0.5;
      this.state.l6.victimBeltY = h * 0.5;
      this.state.l6.isUnhooked = false;
    } else if (levelNum === 7) {
      this.state.l7.victimX = w * 0.35;
      this.state.l7.victimY = h * 0.65;
      this.state.l7.safeX = w * 0.75;
      this.state.l7.safeY = h * 0.35;
      this.state.l7.isRelocated = false;
    } else if (levelNum === 8) {
      this.state.l8.phoneDialed = "";
      this.state.l8.isDialed = false;
    } else if (levelNum === 9) {
      this.state.l9.shoulderTaps = 0;
      this.state.l9.chinTilted = false;
    } else if (levelNum === 10) {
      this.state.l10.cprCount = 0;
      this.state.l10.lastCompressionTime = 0;
    }

    soundManager.speak(this.levelInfo[levelNum - 1].speech);
  }

  update(handTracker, canvasWidth, canvasHeight) {
    if (this.levelComplete) return;

    const cx = handTracker.cursorX;
    const cy = handTracker.cursorY;
    const isPinch = handTracker.isPinching;
    const w = canvasWidth;
    const h = canvasHeight;

    if (this.currentLevel === 1) {
      // Level 1: PPE Selection
      const gloveDist = Math.hypot(cx - (w * 0.3), cy - (h * 0.5));
      const bootDist = Math.hypot(cx - (w * 0.7), cy - (h * 0.5));

      if (isPinch && gloveDist < 70 && !this.state.l1.ppeGloves) {
        this.state.l1.ppeGloves = true;
        soundManager.playGrab();
      }
      if (isPinch && bootDist < 70 && !this.state.l1.ppeBoots) {
        this.state.l1.ppeBoots = true;
        soundManager.playGrab();
      }
      if (this.state.l1.ppeGloves && this.state.l1.ppeBoots) {
        this.completeLevel();
      }
    } else if (this.currentLevel === 2) {
      // Level 2: Unplug
      const dist = Math.hypot(cx - this.state.l2.plugX, cy - this.state.l2.plugY);
      if (isPinch && dist < 60) {
        this.state.l2.plugX = cx;
        this.state.l2.plugY = cy;
        const pullDist = Math.hypot(this.state.l2.plugX - this.state.l2.socketX, this.state.l2.plugY - this.state.l2.socketY);
        if (pullDist > 120 && this.state.l2.isPlugged) {
          this.state.l2.isPlugged = false;
          soundManager.playUnplug();
          this.completeLevel();
        }
      } else if (this.state.l2.isPlugged) {
        this.state.l2.plugX += (this.state.l2.socketX - this.state.l2.plugX) * 0.2;
        this.state.l2.plugY += (this.state.l2.socketY - this.state.l2.plugY) * 0.2;
      }
    } else if (this.currentLevel === 3) {
      // Level 3: Breaker
      const bx = this.state.l3.breakerX;
      const hy = this.state.l3.handleY;
      const dist = Math.hypot(cx - bx, cy - hy);
      if (isPinch && dist < 70) {
        this.state.l3.handleY = Math.max(h * 0.35, Math.min(h * 0.6, cy));
        if (this.state.l3.handleY >= h * 0.58 && this.state.l3.isPowerOn) {
          this.state.l3.isPowerOn = false;
          soundManager.playBreaker();
          this.completeLevel();
        }
      }
    } else if (this.currentLevel === 4) {
      // Level 4: Lay Rubber Mat
      const dist = Math.hypot(cx - this.state.l4.matX, cy - this.state.l4.matY);
      if (isPinch && dist < 80) {
        this.state.l4.matX = cx;
        this.state.l4.matY = cy;
        const targetDist = Math.hypot(this.state.l4.matX - this.state.l4.targetX, this.state.l4.matY - this.state.l4.targetY);
        if (targetDist < 60 && !this.state.l4.isMatPlaced) {
          this.state.l4.isMatPlaced = true;
          soundManager.playGrab();
          this.completeLevel();
        }
      }
    } else if (this.currentLevel === 5) {
      // Level 5: Dynamic Swaying Wire
      if (!this.state.l5.isWireOff) {
        this.state.l5.phase += 0.05;
        this.state.l5.wireX = (w * 0.45) + Math.sin(this.state.l5.phase) * 60;
      }
      const dist = Math.hypot(cx - this.state.l5.wireX, cy - this.state.l5.wireY);
      if (isPinch && dist < 80) {
        this.state.l5.wireX = cx;
        this.state.l5.wireY = cy;
        if (Math.abs(cx - (w * 0.45)) > 150) {
          this.state.l5.isWireOff = true;
          this.completeLevel();
        }
      }
    } else if (this.currentLevel === 6) {
      // Level 6: Unhook Victim
      const dist = Math.hypot(cx - this.state.l6.victimBeltX, cy - this.state.l6.victimBeltY);
      if (isPinch && dist < 70 && !this.state.l6.isUnhooked) {
        this.state.l6.isUnhooked = true;
        soundManager.playGrab();
        this.completeLevel();
      }
    } else if (this.currentLevel === 7) {
      // Level 7: Relocate Victim
      const dist = Math.hypot(cx - this.state.l7.victimX, cy - this.state.l7.victimY);
      if (isPinch && dist < 90) {
        this.state.l7.victimX = cx;
        this.state.l7.victimY = cy;
        const safeDist = Math.hypot(this.state.l7.victimX - this.state.l7.safeX, this.state.l7.victimY - this.state.l7.safeY);
        if (safeDist < 100 && !this.state.l7.isRelocated) {
          this.state.l7.isRelocated = true;
          this.completeLevel();
        }
      }
    } else if (this.currentLevel === 8) {
      // Level 8: Phone Hotline 1129
      if (this.state.l8.phoneDialed === "1129" && !this.state.l8.isDialed) {
        this.state.l8.isDialed = true;
        this.completeLevel();
      }
    } else if (this.currentLevel === 9) {
      // Level 9: Shoulder Tap & Airway
      const shoulderX = w * 0.5;
      const shoulderY = h * 0.55;
      const chinX = w * 0.5;
      const chinY = h * 0.42;

      if (isPinch && Math.hypot(cx - shoulderX, cy - shoulderY) < 60) {
        this.state.l9.shoulderTaps = Math.min(3, this.state.l9.shoulderTaps + 1);
        soundManager.playClick();
      }
      if (isPinch && Math.hypot(cx - chinX, cy - chinY) < 50 && this.state.l9.shoulderTaps >= 3) {
        this.state.l9.chinTilted = true;
        this.completeLevel();
      }
    } else if (this.currentLevel === 10) {
      // Level 10: CPR 100-120 BPM
      const now = Date.now();
      if (now - this.state.l10.lastCompressionTime > 500) {
        this.state.l10.isCPRBeatActive = Math.floor(now / 500) % 2 === 0;
        if (this.state.l10.isCPRBeatActive) soundManager.playCPRBeat();
      }

      const chestX = w * 0.5;
      const chestY = h * 0.6;
      const dist = Math.hypot(cx - chestX, cy - chestY);

      if (isPinch && dist < 70) {
        if (now - this.state.l10.lastCompressionTime > 400) {
          this.state.l10.cprCount++;
          this.state.l10.lastCompressionTime = now;
          soundManager.playClick();
          if (this.state.l10.cprCount >= this.state.l10.targetCPR) {
            this.completeLevel();
          }
        }
      }
    }
  }

  pressKeypad(num) {
    if (this.currentLevel === 8 && this.state.l8.phoneDialed.length < 4) {
      this.state.l8.phoneDialed += num;
      soundManager.playClick();
    }
  }

  completeLevel() {
    this.levelComplete = true;
    this.totalScore += this.score;
    this.starCount = this.score >= 90 ? 3 : (this.score >= 70 ? 2 : 1);
    soundManager.playVictory();
  }

  render(ctx, width, height, handTracker) {
    // Render Environment
    ctx.fillStyle = "#1e0836";
    ctx.fillRect(0, 0, width, height);

    // Floor
    ctx.fillStyle = "#2d124d";
    ctx.fillRect(0, height * 0.7, width, height * 0.3);

    // Render corresponding level UI
    if (this.currentLevel === 1) this.renderL1(ctx, width, height);
    else if (this.currentLevel === 2) this.renderL2(ctx, width, height);
    else if (this.currentLevel === 3) this.renderL3(ctx, width, height);
    else if (this.currentLevel === 4) this.renderL4(ctx, width, height);
    else if (this.currentLevel === 5) this.renderL5(ctx, width, height);
    else if (this.currentLevel === 6) this.renderL6(ctx, width, height);
    else if (this.currentLevel === 7) this.renderL7(ctx, width, height);
    else if (this.currentLevel === 8) this.renderL8(ctx, width, height);
    else if (this.currentLevel === 9) this.renderL9(ctx, width, height);
    else if (this.currentLevel === 10) this.renderL10(ctx, width, height);

    // Cursor
    this.renderCursor(ctx, handTracker);
  }

  renderL1(ctx, w, h) {
    // Gloves Box
    ctx.fillStyle = this.state.l1.ppeGloves ? "#00e676" : "#ffd600";
    ctx.fillRect(w * 0.25 - 50, h * 0.5 - 50, 100, 100);
    ctx.fillStyle = "#111";
    ctx.font = "bold 14px Kanit";
    ctx.textAlign = "center";
    ctx.fillText("ถุงมือฉนวน", w * 0.25, h * 0.5);

    // Boots Box
    ctx.fillStyle = this.state.l1.ppeBoots ? "#00e676" : "#ffd600";
    ctx.fillRect(w * 0.75 - 50, h * 0.5 - 50, 100, 100);
    ctx.fillStyle = "#111";
    ctx.fillText("รองเท้าฉนวน", w * 0.75, h * 0.5);
  }

  renderL2(ctx, w, h) {
    const s = this.state.l2;
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(s.socketX - 40, s.socketY - 40, 80, 80);
    ctx.fillStyle = s.isPlugged ? "#ff5252" : "#00e676";
    ctx.fillRect(s.plugX - 25, s.plugY - 25, 50, 50);
  }

  renderL3(ctx, w, h) {
    const s = this.state.l3;
    ctx.fillStyle = "#37474f";
    ctx.fillRect(s.breakerX - 60, h * 0.25, 120, h * 0.45);
    ctx.fillStyle = s.isPowerOn ? "#ff3d00" : "#00e676";
    ctx.fillRect(s.breakerX - 35, s.handleY - 20, 70, 40);
  }

  renderL4(ctx, w, h) {
    const s = this.state.l4;
    // Wet area
    ctx.fillStyle = "rgba(0, 180, 216, 0.3)";
    ctx.beginPath();
    ctx.ellipse(s.targetX, s.targetY, 120, 60, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rubber Mat
    ctx.fillStyle = s.isMatPlaced ? "#00e676" : "#ffd600";
    ctx.fillRect(s.matX - 60, s.matY - 30, 120, 60);
  }

  renderL5(ctx, w, h) {
    const s = this.state.l5;
    ctx.strokeStyle = s.isWireOff ? "#78909c" : "#ff3d00";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(s.wireX, s.wireY);
    ctx.stroke();
  }

  renderL6(ctx, w, h) {
    ctx.fillStyle = "#78909c";
    ctx.fillRect(w * 0.45, h * 0.3, 100, 150);
    ctx.fillStyle = "#ffd600";
    ctx.beginPath();
    ctx.arc(this.state.l6.victimBeltX, this.state.l6.victimBeltY, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  renderL7(ctx, w, h) {
    const s = this.state.l7;
    ctx.fillStyle = "rgba(0, 230, 118, 0.3)";
    ctx.beginPath();
    ctx.arc(s.safeX, s.safeY, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffb74d";
    ctx.beginPath();
    ctx.arc(s.victimX, s.victimY, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  renderL8(ctx, w, h) {
    const s = this.state.l8;
    ctx.fillStyle = "rgba(20, 10, 35, 0.9)";
    ctx.fillRect(w * 0.35, h * 0.2, w * 0.3, h * 0.65);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(s.phoneDialed || "กด 1129", w * 0.5, h * 0.28);

    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "Call"];
    keys.forEach((k, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const kx = w * 0.4 + col * (w * 0.08);
      const ky = h * 0.36 + row * (h * 0.11);
      ctx.fillStyle = "#6a1b9a";
      ctx.beginPath();
      ctx.arc(kx, ky, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Kanit";
      ctx.fillText(k, kx, ky + 5);
    });
  }

  renderL9(ctx, w, h) {
    ctx.fillStyle = "#ffb74d";
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(`ตบไหล่: ${this.state.l9.shoulderTaps}/3`, w * 0.5, h * 0.35);
  }

  renderL10(ctx, w, h) {
    const s = this.state.l10;
    const beatRadius = s.isCPRBeatActive ? 45 : 30;
    ctx.fillStyle = "rgba(255, 61, 0, 0.4)";
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.58, beatRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(`ปั๊มหัวใจ (CPR): ${s.cprCount} / ${s.targetCPR}`, w * 0.5, h * 0.35);
  }

  renderCursor(ctx, handTracker) {
    const x = handTracker.cursorX;
    const y = handTracker.cursorY;
    const isPinch = handTracker.isPinching;
    ctx.fillStyle = isPinch ? "#00e676" : "#ffd600";
    ctx.beginPath();
    ctx.arc(x, y, isPinch ? 18 : 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

const levelManager = new LevelManager();
