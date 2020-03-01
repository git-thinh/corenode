using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace log
{
    public partial class fMain : Form, IForm
    {
        readonly ILog m_log = null;
        public fMain(ILog log)
        {
            m_log = log;
            InitializeComponent();
            Control.CheckForIllegalCrossThreadCalls = false;
        }

        delegate void SetTextCallback(string text);
        private void writeLog(string text)
        { 
            if (this.txtLog.InvokeRequired)
            {
                SetTextCallback d = new SetTextCallback(writeLog);
                this.Invoke(d, new object[] { text });
            }
            else
            {
                this.txtLog.Text = text;
            }
        }

        public void ShowLog(long id) {
            listKey.Items.Add(id);
            string s = m_log.GetLog(id) + Environment.NewLine + Environment.NewLine;
            writeLog(s);
        }
    }
}
